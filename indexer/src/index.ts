import express, { Request, Response } from 'express';
import { service } from './service';
import { backend } from './backend';
import cors from 'cors';

const app: express.Application = express();

(async () => {
    await backend.init()
    backend.start(50);
    await service.init();
    service.setArtscriptionModule(backend.getArtscriptionModule()!);
    service.setArt20Module(backend.getArt20Module()!);
})();

app.use(cors({
    origin: 'https://galxe.com',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.get('/', async (req: Request, res: Response) => {
    try {
        res.send("helle world");
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while getting data');
    }
});

app.get('/getLast50Artscription', async (req: Request, res: Response) => {
    try {
        res.send(await service.getLast50Artscription());
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while getting data');
    }
});

app.get('/artscriptionDetail', async (req: Request, res: Response) => {
    try {
        const artscriptionId = req.query.id;

        if (!artscriptionId) {
            return res.status(400).send(`artscription ${artscriptionId} doesn\'t exist.`);
        }

        res.send(await service.getArtscriptionDetail(artscriptionId.toString()));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while getting data');
    }
});

app.get('/galxeCampaign', async (req: Request, res: Response) => {
    try {
        const walletAddress = req.query.address;

        if (!walletAddress || walletAddress.length != 42) {
            return res.status(400).send({
                error: `invalid wallet address.`
            });
        }

        res.send({
            completed: await service.isGalxeInscriptionTaskCompleted(walletAddress.toString())
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: 'Error while getting data'
        });
    }
});

app.get('/balance', async (req: Request, res: Response) => {
    const tick = req.query.tick;
    const address = req.query.address;

    if (!tick || !address) {
        return res.status(400).send('Both tick and address are required.');
    }

    try {
        res.send(JSON.stringify(await service.balance(tick.toString(), address.toString())));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while getting data');
    }
});

app.get('/art20', async (req: Request, res: Response) => {
    const tick = req.query.tick;

    if (!tick) {
        return res.status(400).send('Tick are required.');
    }

    try {
        res.send(JSON.stringify(await service.art20(tick.toString())));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while getting data');
    }
});


const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
