import { Art20Module } from './art20';
import { ArtscriptionModule } from './inscription';

class Service {

    private artscriptionModule: ArtscriptionModule | null = null;
    private art20Module: Art20Module | null = null;

    private art20HoldersCountCache: { [tick: string]: { count: number, timestamp: number } } = {};

    async init() {
    }

    async getLast50Artscription(): Promise<Array<any>> {
        return await this.artscriptionModule!.getLastNArtScriptions(50);
    }

    async getArtscriptionDetail(artscriptionId: string): Promise<any> {

        let detail: any = {};
        let artscription = await this.artscriptionModule!.getArtscription(artscriptionId);
        let executionRet = await this.artscriptionModule!.getArtscriptionExecution(artscriptionId);
        detail.artscription = artscription;
        detail.execution = executionRet;

        return detail;
    }

    async isGalxeInscriptionTaskCompleted(walletAddress: string): Promise<boolean> {
        return await this.art20Module!.hasMinted(walletAddress);
    }

    async balance(tick: string, address: string): Promise<Array<any>> {

        let balance = await this.art20Module?.balance(tick.toLocaleLowerCase(), address.toLocaleLowerCase());
        let art20 = await this.art20Module?.art20(tick.toLocaleLowerCase());


        let ret: any = {}
        ret.balance = balance;
        ret.art20 = art20;
        return ret;
    }

    async art20(tick: string): Promise<Array<any>> {

        let art20: any = await this.art20Module!.art20(tick);
        let supply = await this.art20Module!.supply(tick);
        art20.supply = supply;
        art20.holders = this.getArt20HoldersCount(tick);

        return art20;
    }

    getArt20HoldersCount(tick: string): number {

        const cache = this.art20HoldersCountCache[tick];
        const count = cache ? cache.count : 0;

        // async reflesh
        (async () => {
            const now = Date.now();

            if (cache && (now - cache.timestamp < 5 * 60 * 1000)) {
                return;
            }

            try {
                const count = await this.art20Module!.holderCount(tick);
                this.art20HoldersCountCache[tick] = { count, timestamp: now };
            } catch (error) {
                console.log(error);
            }
        })();

        return count;
    }

    setArtscriptionModule(artscriptionModule: ArtscriptionModule): void {
        this.artscriptionModule = artscriptionModule;
    }

    setArt20Module(art20Module: Art20Module): void {
        this.art20Module = art20Module;
    }
};

export const service = new Service();
