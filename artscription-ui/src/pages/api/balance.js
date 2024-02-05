export default async function handler(req, res) {
    const { tick, address } = req.query;
    const host = process.env.REST_HOST || 'http://localhost:3000';
    const targetUrl = `${host}/balance?tick=${tick}&address=${address}`;

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
