const express = require("express");
const router = express.Router();
const lifeHacksController = require("../controllers/lifeHacksController");
const auth = require("../middlewares/auth");
const fs = require("fs");
const db = require("../models");
const {extname, join} = require("node:path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, join(__dirname, '../data/InLifeHackPhoto')); // Убедитесь, что папка существует
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + extname(file.originalname)); // Присвоение уникального имени
    }
});
const uploadInLifeHackPhoto = multer({storage: storage});

router.post("/getAll", auth, lifeHacksController.getAll);
router.post("/", auth, lifeHacksController.createList);
router.post("/:listId/cards", auth, lifeHacksController.createCard);
router.delete("/:listId", auth, lifeHacksController.deleteList);
router.delete("/:listId/cards/:cardId", auth, lifeHacksController.deleteCard);
router.put("/content", auth, lifeHacksController.updateContent);
router.put("/drag", auth, lifeHacksController.dragCard);
router.post("/:cardId/contentPhoto", auth, uploadInLifeHackPhoto.single('file'), async (req, res) => {
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
            const newPhoto = await db.InLifeHackPhoto.create({
                ...req.body,
                LifeHackCardId: req.params.cardId,
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
            await db.InLifeHackPhoto.update(
                { photoLink: newFileName },
                { where: { id: newPhoto.id }, transaction: t }
            );

            const newPhotoToSend = await db.InLifeHackPhoto.findOne({
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

module.exports = router;
