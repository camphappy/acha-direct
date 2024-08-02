
// get the filtered route
app.get('/acha-kvell/item/search', async (req, res) => {
    const { masterCode } = req.query;

    if (!masterCode) {
        return res.status(400).json({ error: 'No search query provided' });
    }

    try {
        const items = await db.collection('items')
            .find({ masterCode: masterCode }) // Adjust this query based on your database
            .toArray();

        res.json({ items });
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});