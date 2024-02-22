import {PoolClient} from 'pg';
import {Constants} from './constants'
import {Art20Error} from "./errors";

export class ArtscriptionModule {

    private config: any;
    private pgClient: PoolClient | null;

    constructor(config: any, pgClient: PoolClient) {
        this.config = config;
        this.pgClient = pgClient;
    }

    async init() {
        const createArtscriptionBaseKV = `
            CREATE TABLE IF NOT EXISTS artscription_base_kv(
                key VARCHAR PRIMARY KEY,
                value JSONB
            );`;

        const createArtscriptionObjectKV = `
            CREATE TABLE IF NOT EXISTS artscription_object_kv(
                key VARCHAR PRIMARY KEY,
                value JSONB,
                block_number BIGINT,
                tx_index INTEGER
            );`;

        const createArtscriptionExecutionKV = `
            CREATE TABLE IF NOT EXISTS artscription_execution_kv(
                key VARCHAR PRIMARY KEY,
                value JSONB
            );`;

        await this.pgClient!.query(createArtscriptionBaseKV);
        await this.pgClient!.query(createArtscriptionObjectKV);
        await this.pgClient!.query(createArtscriptionExecutionKV);

        await this.pgClient!.query('CREATE INDEX IF NOT EXISTS idx_block_number ON artscription_object_kv (block_number DESC);');
        await this.pgClient!.query('CREATE INDEX IF NOT EXISTS idx_tx_index ON artscription_object_kv (tx_index DESC);');
        await this.pgClient!.query('CREATE INDEX IF NOT EXISTS idx_gin_value_artscriptionId ON artscription_object_kv USING GIN ((value -> \'artscriptionId\'));');
        await this.pgClient!.query('CREATE INDEX IF NOT EXISTS idx_gin_value_creator ON artscription_object_kv USING GIN ((value -> \'creator\'));');
        await this.pgClient!.query('CREATE INDEX IF NOT EXISTS idx_gin_value_owner ON artscription_object_kv USING GIN ((value -> \'owner\'));');
    }

    async getLastNArtScriptions(limit: number): Promise<any[]> {
        const queryText = `
        SELECT value 
        FROM artscription_object_kv 
        ORDER BY block_number DESC, tx_index DESC 
        LIMIT $1;
    `;
        const ret = await this.pgClient!.query(queryText, [limit]);

        if (ret.rows.length === 0) {
            return [];
        }

        return ret.rows.map((row) => {
            return row.value;
        });
    }

    async getArtscription(artscriptionId: string): Promise<any | null> {

        let key = Constants.ARTSCRIPTION_STORAGE_PREFIX + artscriptionId;

        const queryText = 'SELECT value FROM artscription_object_kv WHERE key = $1;';
        const ret = await this.pgClient!.query(queryText, [key]);

        if (ret.rows.length === 0) {
            return null;
        }

        return ret.rows[0].value;
    }

    async getArtscriptionExecution(artscriptionId: string): Promise<any | null> {

        let key = Constants.ARTSCRIPTION_EXECUTION + artscriptionId;

        const queryText = 'SELECT value FROM artscription_execution_kv WHERE key = $1;';
        const ret = await this.pgClient!.query(queryText, [key]);

        if (ret.rows.length === 0) {
            return null;
        }

        return ret.rows[0].value;
    }

    async processBlock(txSize: number, block: any): Promise<Array<Artscription>> {

        let artscriptions = new Array<Artscription>();

        for (let i = 0; i < txSize; ++i) {
            let tx = block.transactions[i];

            let artscription = Artscription.parseFromTx(block, tx);

            if (!artscription) {
                continue;
            }

            // let artscriptionNumber = await this.getArtscriptionCount();
            // await this.setArtscriptionCount(artscriptionNumber + 1);
            // artscription.assignArtscriptionNumber(artscriptionNumber);

            console.log("filter artscriptions tx:", tx.hash);

            artscriptions.push(artscription);
        }

        console.log("artscriptions tx in this block:", artscriptions);

        await this.saveArtscriptions(artscriptions);

        return artscriptions;
    }

    async saveArtscriptions(artscriptions: Array<Artscription>): Promise<void> {

        try {
            await this.pgClient!.query('BEGIN');

            for (let artscription of artscriptions) {
                const key = Constants.ARTSCRIPTION_STORAGE_PREFIX + artscription.artscriptionId;
                const value = artscription.encode();
                const blockNumber = artscription.blockNumber;
                const txIndex = artscription.txIndex;

                const queryText = `
                INSERT INTO artscription_object_kv(key, value, block_number, tx_index)
                VALUES ($1, $2::JSONB, $3, $4)
                ON CONFLICT (key)
                DO UPDATE SET value = EXCLUDED.value, block_number = EXCLUDED.block_number, tx_index = EXCLUDED.tx_index;
            `;

                await this.pgClient!.query(queryText, [key, value, blockNumber, txIndex]);
            }

            await this.pgClient!.query('COMMIT');
            console.log(`Artscriptions saved/updated successfully.`);
        } catch (error) {
            await this.pgClient!.query('ROLLBACK');
            throw error;
        }
    }

    async saveArtscriptionExecutions(execRet: Array<any>): Promise<void> {

        try {
            await this.pgClient!.query('BEGIN');

            for (let ret of execRet) {
                const queryText = `INSERT INTO artscription_execution_kv(key, value) VALUES ($1, $2::JSONB) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;`;
                await this.pgClient!.query(queryText, [Constants.ARTSCRIPTION_EXECUTION + ret.artscriptionId, ret]);
            }

            await this.pgClient!.query('COMMIT');
            console.log(`saveArtscriptionExecutions saved/updated successfully.`);
        } catch (error) {
            await this.pgClient!.query('ROLLBACK');
            throw error;
        }
    }
}

export class Artscription {

    originTx: any = null;

    txHash: string = "";
    artscriptionId: string = "";
    creator: string = "";
    owner: string = "";
    mimeType: string = "";
    inscription: any = null;

    blockNumber = 0;
    txIndex = 0;

    constructor(block: any, tx: any) {
        this.originTx = tx;
        this.artscriptionId = tx.hash.toLocaleLowerCase();
        this.creator = tx.from.toLocaleLowerCase();
        this.owner = tx.to.toLocaleLowerCase();
        this.txHash = tx.hash.toLocaleLowerCase();
        this.blockNumber = block.number;
        this.txIndex = tx.transactionIndex;

        this.parseInscription(tx.input);
    }

    encode(): ArtscriptionStoreObject {

        const aso: ArtscriptionStoreObject = {
            txHash: this.txHash,
            artscriptionId: this.artscriptionId,
            creator: this.creator,
            owner: this.owner,
            mimeType: this.mimeType,
            inscription: this.inscription,
            // artscriptionNumber: this.artscriptionNumber
        }

        return aso;
    }

    static parseFromTx(block: any, tx: any): Artscription | null {

        if (!tx.input.startsWith('0x64617461')) {
            return null;
        }

        try {
            return new Artscription(block, tx);
        } catch (error) {
            console.error('scription parse fail', error);
            return null;
        }
    }

    private parseInscription(data: string): void {
        let content = this.hexToUtf8(data);

        if (!content.startsWith("data:")) {
            throw new Art20Error("unknown inscription prefix");
        }

        content = content.slice(5);

        if (content.indexOf(",") < 0) {
            throw new Art20Error("unknown inscription calldata");
        }

        let rawMimeType = content.slice(0, content.indexOf(","));
        content = content.slice(content.indexOf(",") + 1);

        console.log(rawMimeType);
        console.log(content);

        if (rawMimeType == "") {
            this.mimeType = "text/plain";

            try {
                this.inscription = JSON.parse(content.toLocaleLowerCase());
            } catch (error) {
                throw new Art20Error("inscription isn't json");
            }
        } else {
            throw new Art20Error("unknown mime type");
        }
    }

    // assignArtscriptionNumber(num: number): void {
    //     this.artscriptionNumber = num;
    // }

    private hexToUtf8(hexString: string): string {
        if (hexString.startsWith('0x')) {
            hexString = hexString.slice(2);
        }
        return Buffer.from(hexString, 'hex').toString('utf8');
    }
}

export interface ArtscriptionStoreObject {
    txHash: string;
    artscriptionId: string;
    creator: string;
    owner: string;
    mimeType: string;
    inscription: string;
    // artscriptionNumber: number;
}
