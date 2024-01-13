import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { Pool, PoolClient } from 'pg';
import Web3 from 'web3';
import { Art20Module } from './art20';
import { ArtscriptionModule } from './inscription';
import {Art20Error} from "./errors";


const web3 = new Web3(process.env.CHAIN_RPC || 'http://127.0.0.1:8545');

class Backend {
    static readonly PG_KEY_LAST_BLOCK_NUMBER: string = "PG_KEY_LAST_BLOCK_NUMBER";

    private config: any;
    private genesisBlockNumber: number = 0;
    private forceStartFromGenesisBlockNumber: number = 0;

    private pool: Pool | null = null;

    private client: PoolClient | null = null;

    private shouldStop = false;

    private startIndexer = true;

    private artscriptionModule: ArtscriptionModule | null = null;
    private art20Module: Art20Module | null = null;

    constructor() {
        dotenv.config();
        this.loadConfig();
        this.loadEnv();
    }

    loadConfig() {
        const configFile = readFileSync('./config.json', 'utf8');
        this.config = JSON.parse(configFile).backend;
        console.log("config : ", this.config);

        this.genesisBlockNumber = this.config.genesis_block_number;
        this.forceStartFromGenesisBlockNumber = this.config.force_start_from_genesis_block_number;
    }

    loadEnv() {
        this.startIndexer = !process.env.DISABLE_INDEXER;
    }

    async init() {
        try {
            await this.initPostgreSQL();

            if (this.startIndexer) {
                await this.initBackend();
            }

            this.artscriptionModule = new ArtscriptionModule(this.config, this.client!);
            await this.artscriptionModule.init();

            this.art20Module = new Art20Module(this.config, this.client!);
            await this.art20Module.init();
        } catch (error) {
            console.error('Initialization failed', error);
            throw error;
        }
    }

    async initPostgreSQL() {
        const dbConfig = {
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || '127.0.0.1',
            database: 'postgres', // by default, we connect to postgres
            password: process.env.DB_PASS || 'password',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
        }
        this.pool = new Pool(dbConfig);

        this.client = await this.pool.connect();

        const dbName = process.env.DB_DB;
        if (dbName) {
            const res = await this.client.query(`SELECT datname FROM pg_database WHERE datname = '${dbName}';`);
            if (res.rows.length === 0) {
                await this.client.query(`CREATE DATABASE ${dbName};`);
            }
            // update pool and client
            dbConfig.database = dbName;
            this.pool = new Pool(dbConfig);
            this.client = await this.pool.connect();
        }

        const createBlockSync = `
            CREATE TABLE IF NOT EXISTS block_sync(
                id SERIAL PRIMARY KEY,
                key VARCHAR UNIQUE NOT NULL,
                value INTEGER NOT NULL
            );`;

        await this.client.query(createBlockSync);
    }

    async initBackend() {
        if (this.forceStartFromGenesisBlockNumber) {
            console.log("genesisBlockNumber: ", this.genesisBlockNumber);
            await this.setLastSyncBlockNumber(this.genesisBlockNumber);
        }
    }

    async start(intervalMs: number): Promise<void> {
        if (!this.startIndexer) {
            console.log("Indexer is disabled.");
            return;
        }
        console.log(`Backend started with an interval of ${intervalMs} milliseconds.`);
        this.shouldStop = false;
        let lastSyncedTime = 0;
        let currentBlock = 0;
        let lastSyncedBlock = 0;
        while (!this.shouldStop) {
            const now = Date.now();
            if (lastSyncedTime + intervalMs > now && (currentBlock - lastSyncedBlock) <= 3) {
                await new Promise(resolve => setTimeout(resolve, lastSyncedTime + intervalMs - now));
            }
            const res = await this.task();
            if (res) {
                currentBlock = res.current;
                lastSyncedBlock = res.lastSynced;
            } else {
                currentBlock = 0;
                lastSyncedBlock = 0;
            }
            lastSyncedTime = now;
        }
    }

    stop(): void {
        this.shouldStop = true;
        console.log("Backend stopped.");
    }

    async setLastSyncBlockNumber(lastBlockNumber: number): Promise<void> {
        const queryText = `
            INSERT INTO block_sync(key, value)
            VALUES($1, $2)
            ON CONFLICT (key)
            DO 
              UPDATE SET value = $2;`;

        await this.client!.query(queryText, [Backend.PG_KEY_LAST_BLOCK_NUMBER, lastBlockNumber]);
    }

    async getLastSyncBlockNumber(): Promise<number> {
        const queryText = `SELECT value FROM block_sync WHERE key = $1;`;
        const res = await this.client!.query(queryText, [Backend.PG_KEY_LAST_BLOCK_NUMBER]);

        if (res.rows.length === 0) {
            return this.genesisBlockNumber;
        }

        return res.rows[0].value;
    }

    private async task(){
        console.log("\n\nExecuting scheduled task...");
        try {
            return await this.syncBlock();
        } catch (error) {
            console.error('Executing scheduled task failed', error);
        }
    }

    async syncBlock() {
        let lastSyncedBlock = await this.getLastSyncBlockNumber();
        const currentBlockNumber = parseInt((await web3.eth.getBlockNumber()).toString(10), 10);
        if (lastSyncedBlock < 0) {
            // if block < 0, we start from latest block
            lastSyncedBlock = currentBlockNumber - 1;
        } else if (lastSyncedBlock >= currentBlockNumber) {
            // if block >= currentBlockNumber, we do nothing
            console.log(`no new block, waiting for next sync...`);
            return;
        }

        let blockNumber = lastSyncedBlock + 1;
        console.log(`start syncing block: ${blockNumber}`);

        let block = await web3.eth.getBlock(blockNumber, true);

        console.log(`fetched block: ${block.number} -> ${block.hash}`);

        await this.processBlock(block);

        if (block) {
            await this.setLastSyncBlockNumber(blockNumber);
        }

        return {current: currentBlockNumber, lastSynced: blockNumber};
    }

    async processBlock(block: any) {

        let txSize = 0;
        if (null != block.transactions) {
            txSize = block.transactions.length;
        }
        console.log("block tx size:", txSize);

        if (0 == txSize) {
            return;
        }

        const artscriptions = await this.artscriptionModule!.processBlock(txSize, block);

        let execRet: Array<any> = [];
        // execute
        for (let artscription of artscriptions!) {

            let ret: any = {
                artscriptionId: artscription.artscriptionId,
            };

            try {
                if (artscription.mimeType == "text/plain"
                    && artscription.inscription.p == "art-20") {

                    ret.protocol = artscription.inscription.p;

                    await this.art20Module!.processArtscription(artscription);
                } else {
                    throw new Art20Error("un-supported mime type")
                }

                ret.status = "execute success";
                ret.failReason = "-";
            } catch (error) {
                console.log("error:", error);
                if (error instanceof Art20Error) {
                    ret.status = "execute fail";
                    ret.failReason = error.message;
                } else {
                    // rethrow if it's unknown type error
                    throw error;
                }
            }

            execRet.push(ret);
        }

        await this.artscriptionModule!.saveArtscriptionExecutions(execRet);
    }

    getArtscriptionModule(): ArtscriptionModule | null {
        return this.artscriptionModule;
    }

    getArt20Module(): Art20Module | null {
        return this.art20Module;
    }
}

export const backend = new Backend();
