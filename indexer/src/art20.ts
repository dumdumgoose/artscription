import { PoolClient } from 'pg';
import { Artscription } from './inscription';
import { Constants } from './constants';
import { Art20Error } from "./errors";

export class Art20Module {

    private config: any;
    private pgClient: PoolClient | null;

    constructor(config: any, pgClient: PoolClient) {
        this.config = config;
        this.pgClient = pgClient;
    }

    async init() {
        // for art20 object
        const createArt20KV = `
            CREATE TABLE IF NOT EXISTS art20_kv(
                key VARCHAR PRIMARY KEY,
                value JSONB
            );`;

        // for general kv, eg. balance
        const createArt20BaseKV = `
            CREATE TABLE IF NOT EXISTS art20_base_kv(
                key VARCHAR PRIMARY KEY,
                value JSONB,
                block_number BIGINT,
                tx_index INTEGER
            );`;

        await this.pgClient!.query(createArt20KV);
        await this.pgClient!.query(createArt20BaseKV);
    }

    /**
     *
     * @param inscription
     */
    async processArtscription(artscription: Artscription): Promise<void> {
        // {
        //     "p": "art-20",
        //     "op": "deploy | mint | transfer" ,\
        console.log("execute artscription: ", artscription.artscriptionId)
        if (artscription.inscription.p !== "art-20") {
            throw new Art20Error("un-supported protocol")
        }

        let op: string
        try {
            op = artscription.inscription.op;
        } catch (e) {
            throw Art20Error.wrap(e);
        }
        if (op === "deploy") {
            await this.deploy(artscription);
        } else if (op === "mint") {
            await this.mint(artscription);
        } else if (op === "transfer") {
            await this.transfer(artscription);
        } else {
            throw new Art20Error(`un-supported op: ${op}`);
        }
    }

    async deploy(artscription: Artscription): Promise<void> {
        console.log("do deploy:", artscription.inscription.tick);

        //{"p":"art-20","op": "deploy","tick": "arts","max": "21000000","lim": "1000"}
        if (await this.art20(artscription.inscription.tick) !== null) {
            throw new Art20Error("art20 " + artscription.inscription.tick + " has already been deployed");
        }

        let value: Art20 = {
            owner: artscription.owner,
            tick: artscription.inscription.tick,
            max: artscription.inscription.max,
            lim: artscription.inscription.lim,
            inscription: JSON.stringify(artscription.inscription),
            artscriptionId: artscription.artscriptionId,
            txHash: artscription.txHash,
            // artscriptionNumber: artscription.artscriptionNumber.toString(),
        };

        await this.saveArt20(value);
    }

    async mint(artscription: Artscription): Promise<void> {
        // {
        //     "p": "art-20",
        //     "op": "mint",
        //     "tick": "arts",
        //     "amt": "1000"
        // }

        console.log("do mint:", artscription.owner + "," + artscription.inscription.tick + "," + artscription.inscription.amt);

        let art20 = await this.art20(artscription.inscription.tick);

        if (!art20) {
            throw new Art20Error("art20 " + artscription.inscription.tick + " haven't been deployed");
        }

        let amtStr: string = artscription.inscription.amt;
        let amt: number = Number.parseInt(amtStr, 10);
        if (!amtStr ||
            isNaN(amt) ||
            !Number.isInteger(amt) ||
            amt <= 0) {
            throw new Art20Error("Illegal mint inscription, amt must be a positive integer.");
        }

        if (amt > Number.parseInt(art20.lim)) {
            throw new Art20Error("illegal mint inscription, amt is large than lim of tick");
        }

        let supply = await this.supply(artscription.inscription.tick);

        supply += amt;

        if (supply > Number.parseInt(art20.max)) {
            throw new Art20Error("over total supply.");
        }

        let balance = await this.balance(artscription.inscription.tick, artscription.owner);

        balance += amt;

        const { blockNumber, txIndex } = artscription;

        await this.setBaseKVBatch([
            { key: this.balanceKey(artscription.inscription.tick, artscription.owner), value: balance.toString(), blockNumber, txIndex },
            { key: Constants.ARTSCRIPTION_ART20_SUPPLY + artscription.inscription.tick, value: supply.toString(), blockNumber, txIndex },
        ]);
    }

    async transfer(artscription: Artscription): Promise<void> {
        // {
        //     "p": "art-20",
        //     "op": "transfer",
        //     "tick": "arts",
        //     "amt": "69696969"
        //   }
        console.log("do transfer:", artscription.creator + "," + artscription.owner + "," + artscription.inscription.tick + "," + artscription.inscription.amt);

        let art20 = await this.art20(artscription.inscription.tick);

        if (!art20) {
            throw new Art20Error("art20 " + artscription.inscription.tick + " haven't been deployed");
        }

        let amtStr: string = artscription.inscription.amt;
        let amt: number = Number.parseInt(amtStr, 10);
        if (!amtStr ||
            isNaN(amt) ||
            !Number.isInteger(amt) ||
            amt < 0) {
            throw new Art20Error("Illegal mint inscription, amt must be a positive integer.");
        }

        let senderBalance = await this.balance(artscription.inscription.tick, artscription.creator);
        if (senderBalance < amt) {
            throw new Art20Error("illegal transfer inscription, sender balance is not enough. " + senderBalance + " < " + amt);
        }

        if (artscription.creator == artscription.owner) {
            return;
        }

        senderBalance -= amt;

        let receiverBalance = await this.balance(artscription.inscription.tick, artscription.owner);
        receiverBalance += amt;

        const { blockNumber, txIndex } = artscription;

        await this.setBaseKVBatch(
            [
                { key: this.balanceKey(artscription.inscription.tick, artscription.creator), value: senderBalance.toString(), blockNumber, txIndex },
                { key: this.balanceKey(artscription.inscription.tick, artscription.owner), value: receiverBalance.toString(), blockNumber, txIndex }
            ]
        )
    }

    async balance(tick: string, address: string): Promise<number> {

        const ret = await this.getBaseKV(this.balanceKey(tick, address));

        if (null == ret) {
            return 0;
        } else {
            return Number.parseInt(ret);
        }
    }

    async supply(tick: string): Promise<number> {

        const ret = await this.getBaseKV(Constants.ARTSCRIPTION_ART20_SUPPLY + tick);

        if (!ret) {
            return 0;
        } else {
            return Number.parseInt(ret);
        }
    }

    async art20(tick: string): Promise<Art20 | null> {

        const queryText = 'SELECT value FROM art20_kv WHERE key = $1;';
        const ret = await this.pgClient!.query(queryText, [Constants.ARTSCRIPTION_ART20 + tick]);

        if (ret.rows.length === 0) {
            return null;
        }

        return ret.rows[0].value;
    }

    async saveArt20(art20: Art20): Promise<void> {
        const queryText = `INSERT INTO art20_kv(key, value) VALUES ($1, $2::JSONB) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;`;
        await this.pgClient!.query(queryText, [Constants.ARTSCRIPTION_ART20 + art20.tick, art20]);
    }

    async holderCount(tick: string): Promise<number> {
        const queryText = 'SELECT COUNT(*) FROM art20_base_kv WHERE key LIKE $1;';
        const res = await this.pgClient!.query(queryText, [Constants.ARTSCRIPTION_ART20_BALANCE + tick + "#" + '%']);
        return parseInt(res.rows[0].count, 10);
    }

    async hasMinted(address: string): Promise<boolean> {
        return (await this.balance('wave1', address.toLocaleLowerCase())) > 0
            || (await this.balance('wave1.1', address.toLocaleLowerCase())) > 0
            || (await this.balance('wave1.2', address.toLocaleLowerCase())) > 0;
    }

    async getAllTicks(): Promise<string[]> {
        const queryText = 'SELECT key FROM art20_kv;';
        const ret = await this.pgClient!.query(queryText);
        return ret.rows.map((row) => {
            return row.key.replace(Constants.ARTSCRIPTION_ART20, '');
        });
    }

    async getBaseKV(key: string): Promise<any | null> {
        const queryText = 'SELECT value FROM art20_base_kv WHERE key = $1;';
        const ret = await this.pgClient!.query(queryText, [key]);

        if (ret.rows.length === 0) {
            return null;
        }

        return ret.rows[0].value;
    }

    async setBaseKV(key: string, value: any, blockNumber: number, txIndex: number): Promise<void> {
        const queryText = `
        INSERT INTO art20_base_kv(key, value, block_number, tx_index) 
        VALUES ($1, $2::JSONB, $3, $4) 
        ON CONFLICT (key) 
        DO UPDATE SET value = EXCLUDED.value, block_number = EXCLUDED.block_number, tx_index = EXCLUDED.tx_index
        WHERE art20_base_kv.block_number < EXCLUDED.block_number OR 
        (art20_base_kv.block_number = EXCLUDED.block_number AND art20_base_kv.tx_index < EXCLUDED.tx_index);
    `;
        await this.pgClient!.query(queryText, [key, value, blockNumber, txIndex]);
    }

    async setBaseKVBatch(kvs: Array<{ key: string, value: any, blockNumber: number, txIndex: number }>): Promise<void> {

        try {
            await this.pgClient!.query('BEGIN');

            for (let kv of kvs) {
                await this.setBaseKV(kv.key, kv.value, kv.blockNumber, kv.txIndex);
            }

            await this.pgClient!.query('COMMIT');
        } catch (error) {
            await this.pgClient!.query('ROLLBACK');
            throw error;
        }
    }

    balanceKey(tick: string, address: string) {
        return Constants.ARTSCRIPTION_ART20_BALANCE + tick + "#" + address;
    }
}

export interface Art20 {
    owner: string;
    tick: string;
    max: string;
    lim: string;
    artscriptionId: string;
    inscription: string;
    txHash: string;
    // artscriptionNumber?: string;
}
