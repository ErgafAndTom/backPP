// routes/counterparty.js
const express = require('express');
const {post} = require("axios");
const router = express.Router();
const NOVAPOSHTA_API_KEY = process.env.NOVAPOSHTA_API_KEY;

// Пример: функция для получения списка контрагентов из базы данных
async function getCounterpartiesFromDB() {
    const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';
    const payload = {
        apiKey: NOVAPOSHTA_API_KEY,
        modelName: 'CounterpartyGeneral',
        calledMethod: 'getCounterparties',
        methodProperties: {
            // Ref : "00000000-0000-0000-0000-000000000000",
            CounterpartyProperty: "Sender",
            Page: 1,
        }
    };
    try {
        console.log(payload);
        const response = await post(apiUrl, payload);
        return response.data;
    } catch (error) {
        throw new Error(`Помилка при зверненні до API Нової Пошти: ${error.message}`);
    }
}

// Пример: функция для сохранения нового контрагента
async function saveCounterpartyToDB(newCounterparty) {
    // Здесь должна быть логика сохранения в БД
    return newCounterparty; // замените на сохранённый объект
}

// Пример: функция для обновления контрагента
async function updateCounterpartyInDB(ref, updateData) {
    // Здесь должна быть логика обновления в БД
    return { ref, ...updateData }; // замените на обновлённый объект
}

// Получение списка контрагентов
router.get('/', async (req, res) => {
    try {
        const counterparties = await getCounterpartiesFromDB();
        res.json({ success: true, data: counterparties });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Добавление нового контрагента
router.post('/', async (req, res) => {
    try {
        const newCounterparty = req.body;
        const savedCounterparty = await saveCounterpartyToDB(newCounterparty);
        res.json({ success: true, data: savedCounterparty });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Обновление данных контрагента (передаётся идентификатор в параметрах)
router.put('/:ref', async (req, res) => {
    try {
        const ref = req.params.ref;
        const updateData = req.body;
        const updatedCounterparty = await updateCounterpartyInDB(ref, updateData);
        res.json({ success: true, data: updatedCounterparty });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
