const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const { Op } = require("sequelize");
const path = require("path");
const {generateInvoiceDocx} = require("../services/document/generate_invoice");

// Получение списка всех материалов (только для администратора и менеджера)
// route,

router.post(
    '/All',
    authMiddleware,
    roleMiddleware(['admin', 'manager' , 'operator']),
    async (req, res) => {
        try {
            const pageNumber = req.body?.currentPage || 1;
            const pageSize = req.body?.inPageCount || 10;
            const columnNameForOrder = req.body?.columnName?.column || 'id';
            const searchString = `%${req.body?.search || ''}%`;

            let fieldsForSearch = Object.keys(db.Material.rawAttributes);
            let searchConditions = fieldsForSearch.map(field => ({ [field]: { [Op.like]: searchString } }));
            let toColumn = req.body?.columnName?.reverse ? 'DESC' : 'ASC';


            const result = await db.Material.findAndCountAll({
                offset: (pageNumber - 1) * pageSize,
                limit: pageSize,
                where: {
                    [Op.or]: searchConditions
                },
                order: [
                    [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                ],
            });
            result.metadata = Object.keys(db.Material.rawAttributes);
            result.metadataProductUnit = Object.keys(db.Material.rawAttributes);
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Помилка при отриманні даних' });
        }
    }
);

router.post(
    '/NotAll',
    authMiddleware,
    roleMiddleware(['admin', 'manager' , 'operator']),
    async (req, res) => {
        try {
            const pageNumber = req.body.currentPage; // Номер страницы (первая страница - 1)
            const pageSize = req.body.inPageCount; // Размер страницы
            // console.log(req.body);

            let toSend = {
                rows: [],
                metadata: []
            };
            if (req.body.material.type === "Папір" || req.body.material.type === "Плівка") {
                if(req.body.material.typeUse === 'Широкоформат'){
                    toSend = await db.Material.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        where: {
                            type: req.body.material.type,
                            typeUse: req.body.material.typeUse,
                        }
                    })
                } else {
                    if(req.body.size.x === 210 && req.body.size.y === 297 || req.body.size.x === 297 && req.body.size.y === 420){
                        if (req.body.material.typeUse === 'Офісний') {
                            toSend = await db.Material.findAndCountAll({
                                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                                limit: pageSize, // Количество записей на странице
                                where: {
                                    type: req.body.material.type,
                                    typeUse: req.body.material.typeUse,
                                    x: req.body.size.x,
                                    y: req.body.size.y,
                                }
                            });
                        } else {
                            toSend = await db.Material.findAndCountAll({
                                offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                                limit: pageSize, // Количество записей на странице
                                where: {
                                    type: req.body.material.type,
                                    typeUse: req.body.material.typeUse,
                                    x: 297,
                                    y: 420,
                                }
                            });
                        }
                    } else {
                        toSend = await db.Material.findAndCountAll({
                            offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                            limit: pageSize, // Количество записей на странице
                            where: {
                                type: req.body.material.type,
                                typeUse: req.body.material.typeUse,
                                x: 297,
                                y: 420,
                            }
                        })
                    }
                }
            } else if (req.body.material.type === "Фотопапір"){
                toSend = await db.Material.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                    where: {
                        type: req.body.material.type,
                        // typeUse: req.body.material.typeUse,
                        x: req.body.size.x,
                        y: req.body.size.y,
                    }
                })
            } else if (req.body.material.type === "Ламінування"){
                console.log(req.body.type);
                if(req.body.type === "SheetCut" || req.body.type === "SheetCutBw"){
                    toSend = await db.Material.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        where: {
                            // type: req.body.material.type,
                            // // name: req.body.material.thickness,
                            x: 297,
                            y: 420,
                            type: "Ламінування",
                            name: req.body.material.material,
                            // typeUse: req.body.material.typeUse,
                        }
                    })
                } else {
                    toSend = await db.Material.findAndCountAll({
                        offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                        limit: pageSize, // Количество записей на странице
                        where: {
                            // type: req.body.material.type,
                            // // name: req.body.material.thickness,
                            x: req.body.size.x,
                            y: req.body.size.y,
                            type: "Ламінування",
                            name: req.body.material.material,
                            // typeUse: req.body.material.typeUse,
                        }
                    })
                }
            } else if (req.body.material.type === "Папір Широкоформат"){
                toSend = await db.Material.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                    where: {
                        type: req.body.material.type,
                        // name: body.material.material
                    }
                })
            } else if (req.body.material.type === "Pereplet"){
                toSend = await db.Material.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                    where: {
                        type: "Перепліт",
                        x: req.body.size.x,
                        y: req.body.size.y,
                        thickness: req.body.pereplet.size,
                        // name: body.material.material
                    }
                })
            } else if (req.body.material.type === "Vishichka"){
                toSend = await db.Material.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                    where: {
                        type: "Постпресс",
                        typeUse: "Висічка",
                        // x: req.body.size.x,
                        // y: req.body.size.y,
                        // thickness: req.body.pereplet.size,
                        // name: body.material.material
                    }
                })
            } else if (req.body.material.type === "Чашки"){
                toSend = await db.Material.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Смещение для текущей страницы
                    limit: pageSize, // Количество записей на странице
                    where: {
                        type: req.body.material.type,
                        // typeUse: req.body.material.typeUse,
                        // x: req.body.size.x,
                        // y: req.body.size.y,
                    }
                })
            }
            toSend.metadata = Object.keys(db.Material.rawAttributes)
            res.status(200).json(toSend);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Помилка при отриманні даних' });
        }
    }
);


// Создание нового материала (только для администратора)
router.post(
    '/',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req, res) => {
        try {
            const result = await db.sequelize.transaction(async (t) => {
                const { name, description, quantity, unit } = req.body;
                const  material = await db.Material.create({
                    name,
                    description,
                    quantity,
                    unit,
                });



                const pageNumber = req.body?.currentPage || 1;
                const pageSize = req.body?.inPageCount || 10;
                const columnNameForOrder = req.body?.columnName?.column || 'id';
                const searchString = `%${req.body?.search || ''}%`;

                let fieldsForSearch = Object.keys(db.Material.rawAttributes);
                let searchConditions = fieldsForSearch.map(field => ({ [field]: { [Op.like]: searchString } }));
                let toColumn = req.body?.columnName?.reverse ? 'DESC' : 'ASC';


                const result = await db.Material.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize,
                    limit: pageSize,
                    where: {
                        [Op.or]: searchConditions
                    },
                    order: [
                        [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                    ],
                });
                result.metadata = Object.keys(db.Material.rawAttributes);
                result.metadataProductUnit = Object.keys(db.Material.rawAttributes);
                return result
            });
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при создании материала' });
        }
    }
);

// Обновление материала (только для администратора)
router.put(
    '/OnlyOneField',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req, res) => {
        try {
            const pageNumber = req.body.currentPage; // Номер сторінки (перша сторінка - 1)
            const pageSize = req.body.inPageCount; // Розмір сторінки
            const columnNameForOrder = req.body.columnName.column; // Ім'я колонки для сортування
            const searchString = `%${req.body.search}%`;
            let fieldsForSearch = Object.keys(db.Material.rawAttributes);
            let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
            let toColumn = 'ASC'
            if (req.body.columnName.reverse) {
                toColumn = 'DESC'
            }


            const updatedFields = {};
            updatedFields[req.body.tablePosition] = req.body.input
            const [rowsUpdated] = await db.Material.update(updatedFields, {
                where: {id: req.body.id},
            });
            console.log(rowsUpdated);
            console.log(req.body.id);
            if (rowsUpdated === 1) {
                const materials = await db.Material.findAndCountAll({
                    offset: (pageNumber - 1) * pageSize, // Зсув для поточної сторінки
                    limit: pageSize, // Кількість записів на сторінці
                    where: {
                        [Op.or]: SearchConditions
                    },
                    order: [
                        [columnNameForOrder, toColumn] // Сортування за заданою колонкою
                    ]
                });
                materials.metadata = Object.keys(db.Material.rawAttributes);
                console.log(req.body.id);
                res.status(200).json(materials);
            } else {
                res.status(500).json({error: 'Обновлено 0 rows'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Ошибка при обновлении заказа'});
        }
    }
);

// Удаление материала (только для администратора)
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req, res) => {
        try {
            const material = await db.Material.findByPk(req.params.id);
            if (!material) {
                return res.status(404).json({ error: 'Материал не найден' });
            }
            await material.destroy();
            res.status(200).json({ message: 'Материал удален' });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении материала' });
        }
    }
);

module.exports = router;
