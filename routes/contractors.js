const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const roleMiddleware = require('../middlewares/role');
const authMiddleware = require('../middlewares/auth');
const {Op} = require("../back/modelDB");
const { generateInvoiceDocx } = require('../services/document/generate_invoice');
const path = require('path');
const {readdirSync, existsSync} = require("node:fs");

router.post("/addContractor",
    authMiddleware,
    async function (req, res) {
        try {
            const formValues = req.body.formData;
            const userId = req.body.clientId;
            console.log(req.body);
            const Contractor = await db.Contractor.create({
                name: formValues.name,
                type: formValues.type,
                address: formValues.address,
                bankName: formValues.bankName,
                iban: formValues.iban,
                edrpou: formValues.edrpou,
                email: formValues.email,
                phone: formValues.phone,
                taxSystem: formValues.taxSystem,
                pdv: formValues.pdv,
                comment: formValues.comment,
                userId: userId,
            });
            res.status(201).json(Contractor);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ошибка отправки' });
        }
    })

router.post("/updateContractor",
    authMiddleware,
    async function (req, res) {
        try {
            const formValues = req.body.formData;
            const contractorId = req.body.contractorId;

            console.log(req.body);

            const result = await db.sequelize.transaction(async (t) => {
                const updatedRowsCount = await db.Contractor.update(
                    {
                        name: formValues.name,
                        type: formValues.type,
                        address: formValues.address,
                        bankName: formValues.bankName,
                        iban: formValues.iban,
                        edrpou: formValues.edrpou,
                        email: formValues.email,
                        phone: formValues.phone,
                        taxSystem: formValues.taxSystem,
                        pdv: formValues.pdv,
                        comment: formValues.comment,
                    },
                    {
                        where: {id: contractorId}
                    }, {transaction: t}
                );

                if (updatedRowsCount[0] === 0) {
                    return res.status(404).json({ error: "Контрагента не знайдено або немає прав на редагування" });
                }

                return await db.Contractor.findByPk(contractorId, {transaction: t});
            });
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Помилка оновлення' });
        }
    });

router.delete("/deleteContractor/:id",
    authMiddleware,
    async function (req, res) {
        try {
            const id = req.params.id;
            console.log(req.body);
            console.log(id);
            const Contractor = await db.Contractor.destroy({
                where: {id: id}
            });
            res.status(200).json(Contractor);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ошибка отправки' });
        }
    })

router.post("/getMyContractors",
    authMiddleware,
    async function (req, res) {
        try {
            const pageNumber = req.body.currentPage; // Номер сторінки (перша сторінка - 1)
            const pageSize = req.body.inPageCount; // Розмір сторінки
            const columnNameForOrder = req.body.columnName.column; // Ім'я колонки для сортування
            const searchString = `%${req.body.search}%`;
            let fieldsForSearch = Object.keys(db.Contractor.rawAttributes);
            let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
            let toColumn = 'ASC'
            let userId = req.params.id;
            if (req.body.columnName.reverse) {
                toColumn = 'DESC'
            }
            console.log(SearchConditions);
            const users = await db.Contractor.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Зсув для поточної сторінки
                limit: pageSize, // Кількість записів на сторінці
                where: {
                    [Op.and]: [
                        { userId: req.userId },          // ← сюди підстав айді
                        { [Op.or]: SearchConditions }        // ← як було
                    ]
                },
                order: [
                    [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                ]
            });
            users.metadata = Object.keys(db.Contractor.rawAttributes);
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ошибка отправки' });
        }
    })

router.post("/getContractors",
    authMiddleware,
    async function (req, res) {
        try {
            const pageNumber = req.body.currentPage; // Номер сторінки (перша сторінка - 1)
            const pageSize = req.body.inPageCount; // Розмір сторінки
            const columnNameForOrder = req.body.columnName.column; // Ім'я колонки для сортування
            const searchString = `%${req.body.search}%`;
            let fieldsForSearch = Object.keys(db.Contractor.rawAttributes);
            let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
            let toColumn = 'ASC'
            let userId = req.body.clientId;
            if (req.body.columnName.reverse) {
                toColumn = 'ASC'
            }
            console.log(SearchConditions);
            const users = await db.Contractor.findAndCountAll({
                offset: (pageNumber - 1) * pageSize, // Зсув для поточної сторінки
                limit: pageSize, // Кількість записів на сторінці
                where: {
                    [Op.and]: [
                        { userId: userId },          // ← сюди підстав айді
                        { [Op.or]: SearchConditions }        // ← як було
                    ]
                },
                order: [
                    [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                ]
            });
            users.metadata = Object.keys(db.Contractor.rawAttributes);
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ошибка отправки' });
        }
    })

module.exports = router;