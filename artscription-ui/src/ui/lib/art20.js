export default async function handler(req, res) {

    const host = process.env.REST_HOST || 'http://localhost:3000';

    const { tick } = req.query;
    const targetUrl = `${host}/art20?tick=${tick}`;

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
