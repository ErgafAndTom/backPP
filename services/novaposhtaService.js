const axios = require('axios');
const NOVAPOSHTA_API_KEY = process.env.NOVAPOSHTA_API_KEY;
const NOVAPOSHTA_API_URL = process.env.NOVAPOSHTA_API_URL;

// Функція для створення накладної через API Нової Пошти
const createWaybill = async (data) => {
    const payload = {
        apiKey: NOVAPOSHTA_API_KEY,
        modelName: 'InternetDocumentGeneral',
        calledMethod: 'save', // Перевірте документацію – можливо, потрібен інший метод
        methodProperties: data, // Наприклад: { SenderCity: "Київ", RecipientCity: "Львів", Weight: "5", Cost: "1000", ... }
    };
    try {
        const response = await axios.post(NOVAPOSHTA_API_URL, payload);
        return response.data;
    } catch (error) {
        throw new Error(`Помилка при зверненні до API Нової Пошти: ${error.message}`);
    }
};

const getScanSheetList = async (data) => {
    const payload = {
        apiKey: NOVAPOSHTA_API_KEY,
        modelName: 'ScanSheetGeneral',
        calledMethod: 'getScanSheetList',
        methodProperties: {
            // findByString: data // название города для поиска
        }
    };
    try {
        const response = await axios.post(NOVAPOSHTA_API_URL, payload);
        return response.data;
    } catch (error) {
        throw new Error(`Помилка при зверненні до API Нової Пошти: ${error.message}`);
    }
};

async function createCounterparty(personData) {
    const response = await axios.post(NOVAPOSHTA_API_URL, {
        apiKey: NOVAPOSHTA_API_KEY,
        modelName: 'Counterparty',
        calledMethod: 'save',
        methodProperties: {
            CounterpartyType: 'PrivatePerson',
            CounterpartyProperty: personData.isSender ? 'Sender' : 'Recipient',
            FirstName: personData.firstName,
            MiddleName: personData.middleName,
            LastName: personData.lastName,
            Phone: personData.phone,
            CityRef: personData.cityRef
        }
    });
    if (response.data.success) {
        return response.data.data[0].Ref;
    } else {
        throw new Error(response.data.errors.join(', '));
    }
}
async function createContactPerson(contactData) {
    const response = await axios.post(NOVAPOSHTA_API_URL, {
        apiKey: NOVAPOSHTA_API_KEY,
        modelName: 'ContactPerson',
        calledMethod: 'save',
        methodProperties: {
            CounterpartyRef: contactData.counterpartyRef,
            FirstName: contactData.firstName,
            MiddleName: contactData.middleName,
            LastName: contactData.lastName,
            Phone: contactData.phone
        }
    });
    if (response.data.success) {
        return response.data.data[0].Ref;
    } else {
        throw new Error(response.data.errors.join(', '));
    }
}

module.exports = { createWaybill, getScanSheetList, createCounterparty, createContactPerson };
//https://alexpseha.gitbooks.io/api_test_one_chapter/content/1_1_osobistii_kabnet_api_20br.html ---- API
//https://github.com/lis-dev/nova-poshta-api-2/blob/master/README.ua.md ---- API 2