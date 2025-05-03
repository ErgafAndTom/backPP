const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');
const ExcelJS = require("exceljs");
const fs = require("fs");
const multer = require('multer');
const {join, extname} = require("node:path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, join(__dirname, '../data/inTrelloPhoto')); // Убедитесь, что папка существует
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + extname(file.originalname)); // Присвоение уникального имени
    }
});
const uploadInTrelloPhoto = multer({storage: storage});

// Отримати всі списки з картками
router.post('/getdata',
    authMiddleware,
    async (req, res) => {
    try {
        const lists = await db.List.findAll({
            include: [
                {
                    model: db.Card,
                    include: [
                        {model: db.User, as: 'createdBy', attributes: ['id', 'username']},
                        {model: db.User, as: 'lastUpdatedBy', attributes: ['id', 'username']},
                        {model: db.User, as: 'assignedTo', attributes: ['id', 'username']},
                        {model: db.InTrelloPhoto,
                            as: 'inTrelloPhoto',
                            include: [
                                {model: db.User, as: 'createdBy', attributes: ['id', 'username']}
                            ]}
                    ]
                },
                {
                    model: db.User,
                    as: 'createdBy',
                    attributes: ['id', 'username']
                },
                {
                    model: db.User,
                    as: 'assignedTo',
                    attributes: ['id', 'username']
                }
            ]
        });
        res.status(200).json(lists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Створити новий список
router.post('/',
    authMiddleware,
    async (req, res) => {
    try {
        await db.sequelize.transaction(async (t) => {
            const newList = await db.List.create({
                title: req.body.title,
                createdById: req.userId,
            }, {transaction: t});
            const newListToSend = await db.List.findOne({
                where: { id: newList.id },
                include: [
                    {
                        model: db.Card,
                        include: [
                            {model: db.User, as: 'createdBy', attributes: ['id', 'username']},
                            {model: db.User, as: 'lastUpdatedBy', attributes: ['id', 'username']},
                            {model: db.User, as: 'assignedTo', attributes: ['id', 'username']},
                            {model: db.InTrelloPhoto,
                                as: 'inTrelloPhoto',
                                include: [
                                    {model: db.User, as: 'createdBy', attributes: ['id', 'username']}
                                ]}
                        ]
                    },
                    {
                        model: db.User,
                        as: 'createdBy',
                        attributes: ['id', 'username']
                    },
                    {
                        model: db.User,
                        as: 'assignedTo',
                        attributes: ['id', 'username']
                    }
                ], transaction: t
            })
            res.status(201).json(newListToSend);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка створення списку' });
    }
});

router.put('/content',
    authMiddleware,
    async (req, res) => {
    try {
        const cardId = req.body.cardId;
        const newContent = req.body.newContent;
        await db.sequelize.transaction(async (t) => {
            await db.Card.update(
                {content: newContent, lastUpdatedById: req.userId},
                {where: {id: cardId}, transaction: t}
            );
            const newCard = await db.Card.findOne({
                where: {id: cardId},
                include: [
                    {model: db.User, as: 'createdBy', attributes: ['id', 'username']},
                    {model: db.User, as: 'lastUpdatedBy', attributes: ['id', 'username']},
                    {model: db.User, as: 'assignedTo', attributes: ['id', 'username']},
                    {model: db.InTrelloPhoto,
                        as: 'inTrelloPhoto',
                        include: [
                            {model: db.User, as: 'createdBy', attributes: ['id', 'username']}
                        ]}
                ],
                transaction: t
            })
            res.status(200).json(newCard);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

router.put('/drag',
    authMiddleware,
    async (req, res) => {
    try {
        const cardId = req.body.cardId;
        const fromListId = req.body.fromListId;
        const toListId = req.body.toListId;
        const fromIndex = req.body.fromIndex;
        const toIndex = req.body.toIndex;
        await db.sequelize.transaction(async (t) => {
            await db.Card.update(
                { listId: toListId},
                { where: { id: cardId }, transaction: t }
            );
            const newListToSend = await db.List.findAll({
                include: [
                    {
                        model: db.Card,
                        include: [
                            {model: db.User, as: 'createdBy', attributes: ['id', 'username']},
                            {model: db.User, as: 'lastUpdatedBy', attributes: ['id', 'username']},
                            {model: db.User, as: 'assignedTo', attributes: ['id', 'username']},
                            {model: db.InTrelloPhoto,
                                as: 'inTrelloPhoto',
                                include: [
                                    {model: db.User, as: 'createdBy', attributes: ['id', 'username']}
                                ]}
                        ]
                    },
                    {
                        model: db.User,
                        as: 'createdBy',
                        attributes: ['id', 'username']
                    },
                    {
                        model: db.User,
                        as: 'assignedTo',
                        attributes: ['id', 'username']
                    }
                ], transaction: t
            })
            res.status(200).json(newListToSend);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Видалити список та всі його картки
router.delete('/:id',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req, res) => {
    try {
        const list = await db.List.findByPk(req.params.id);
        if (!list) {
            return res.status(404).json({ message: 'Список не знайдено' });
        }
        await db.Card.destroy({ where: { listId: list.id } });
        await list.destroy();
        res.status(200).json({ message: 'Список видалено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Додати картку до списку
router.post('/:listId/cards',
    authMiddleware,
    async (req, res) => {
    try {
        await db.sequelize.transaction(async (t) => {
            const newCard = await db.Card.create({ ...req.body, listId: req.params.listId, createdById: req.userId, lastUpdatedById: req.userId }, {transaction: t});
            const newListToSend = await db.Card.findOne({
                where: {id: newCard.id},
                include: [
                    {model: db.User, as: 'createdBy', attributes: ['id', 'username']},
                    {model: db.User, as: 'lastUpdatedBy', attributes: ['id', 'username']},
                    {model: db.User, as: 'assignedTo', attributes: ['id', 'username']},
                    {model: db.InTrelloPhoto,
                        as: 'inTrelloPhoto',
                    include: [
                            {model: db.User, as: 'createdBy', attributes: ['id', 'username']}
                        ]}
                ], transaction: t
            })
            res.status(201).json(newListToSend);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка створення картки' });
    }
});

// Видалити картку
router.delete('/:listId/cards/:cardId', authMiddleware, async (req, res) => {
    const { listId, cardId } = req.params;

    try {
        await db.sequelize.transaction(async (t) => {
            // Находим карточку по id и listId
            const card = await db.Card.findOne({
                where: { id: cardId, listId },
                transaction: t
            });
            if (!card) {
                return res.status(404).json({ message: 'Картка не знайдена' });
            }

            // Находим все файлы, привязанные к карточке (предполагается наличие поля cardId)
            const attachedFiles = await db.InTrelloPhoto.findAll({
                where: { cardId },
                transaction: t
            });

            // Итеративно удаляем каждый файл с диска
            for (const file of attachedFiles) {
                const filePath = join(__dirname, '../data/inTrelloPhoto', file.photoLink);
                try {
                    await fs.promises.unlink(filePath);
                    console.log(`Файл ${file.photoLink} успішно видалено`);
                } catch (err) {
                    console.error(`Помилка при видаленні файлу ${file.photoLink}:`, err);
                    // Можно решить: либо прерывать транзакцию, либо логировать и продолжать
                }
            }

            // Удаляем записи файлов из базы данных
            await db.InTrelloPhoto.destroy({
                where: { cardId },
                transaction: t
            });

            // Удаляем карточку
            await card.destroy({ transaction: t });

            res.status(200).json({ message: 'Картка та пов\'язані файли видалені' });
        });
    } catch (error) {
        console.error('Помилка при видаленні картки та файлів:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});


router.post('/:cardId/contentPhoto',
    authMiddleware,
    uploadInTrelloPhoto.single('file'), async (req, res) => {
        if (!req.file) {
            return res.status(400).send('Файл не загружен.');
        }
        if (!req.file.mimetype.startsWith('image/')) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Ошибка при удалении файла:', err);
                } else {
                    console.log('Файл успешно удалён, так как это не изображение');
                }
            });
            return res.status(400).send('Файл не является изображением.');
        }

        try {
            await db.sequelize.transaction(async (t) => {

                // Створюємо запис у базі без імені файлу
                const newPhoto = await db.InTrelloPhoto.create({
                    ...req.body,
                    cardId: req.params.cardId,
                    createdById: req.userId
                }, { transaction: t });

                // Отримуємо розширення файлу
                const fileExt = extname(req.file.originalname);
                const newFileName = `${newPhoto.id}_${req.file.originalname}`;

                // Шлях нового файлу
                const newFilePath = join(req.file.destination, newFileName);

                // Перейменовуємо файл
                fs.rename(req.file.path, newFilePath, (err) => {
                    if (err) {
                        console.error('Ошибка при переименовании файла:', err);
                        throw new Error('Ошибка при обработке файла.');
                    }
                });

                // Оновлюємо запис у базі даних з новим іменем файлу
                await db.InTrelloPhoto.update(
                    { photoLink: newFileName },
                    { where: { id: newPhoto.id }, transaction: t }
                );

                const newPhotoToSend = await db.InTrelloPhoto.findOne({
                    where: { id: newPhoto.id },
                    include: [
                        { model: db.User, as: 'createdBy', attributes: ['id', 'username'] }
                    ],
                    transaction: t
                });

                res.status(201).json(newPhotoToSend);
            });
        } catch (error) {
            console.error('Ошибка при загрузке фото:', error);
            res.status(500).send('Ошибка при загрузке фото.');
        }
    });


// Удаление фото карточки
router.delete('/:photoId/contentPhoto', authMiddleware, async (req, res) => {
    const photoId = req.params.photoId;

    try {
        await db.sequelize.transaction(async (t) => {
            // Ищем запись фото в базе данных
            const photo = await db.InTrelloPhoto.findOne({
                where: { id: photoId },
                transaction: t
            });

            if (!photo) {
                return res.status(404).send('Фото не найдено.');
            }

            // Формируем полный путь к файлу
            const filePath = join(__dirname, '../data/inTrelloPhoto', photo.photoLink);

            // Удаляем файл с диска
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Ошибка при удалении файла:', err);
                    // Если ошибка возникает при удалении файла, можно логировать и продолжать удаление записи
                } else {
                    console.log('Файл успешно удалён');
                }
            });

            // Удаляем запись из базы данных
            await db.InTrelloPhoto.destroy({
                where: { id: photoId },
                transaction: t
            });
            res.sendStatus(200);
        });

        // Если всё прошло успешно, отправляем статус 200
    } catch (error) {
        console.error('Ошибка при удалении фото:', error);
        res.status(500).send('Ошибка при удалении фото.');
    }
});


module.exports = router;
