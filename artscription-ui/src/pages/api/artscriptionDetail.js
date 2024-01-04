export default async function handler(req, res) {
    const { id } = req.query;
    const host = process.env.REST_HOST || 'localhost';
    const port = process.env.REST_PORT || 3000;
    const targetUrl = `http://${host}:${port}/artscriptionDetail?id=${id}`;

    try {
        const apiRes = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: req.method === 'POST' ? JSON.stringify(req.body) : null,
        });

        if (!apiRes.ok) {
            throw new Error(`Failed to fetch ${targetUrl}`);
        }

        const data = await apiRes.json();

        res.status(200).json(data);
    } catch (error) {
        console.error("Error occurred while proxying: ", error);
        res.status(500).json({ message: "Server error occurred." });
    }
}
