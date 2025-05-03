// routes/novaposhta.js
const express = require('express');
const router = express.Router();
const { createWaybill, getScanSheetList, createCounterparty, createContactPerson } = require('../services/novaposhtaService');

router.post('/create', async (req, res) => {
    try {
        const data = req.body; // Очікуємо, що дані надходитимуть з фронтенду
        const result = await createWaybill(data);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/getScanSheetList', async (req, res) => {
    try {
        const data = req.body; // Очікуємо, що дані надходитимуть з фронтенду
        const result = await getScanSheetList(data);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
