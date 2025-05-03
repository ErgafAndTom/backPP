const db = require("../models");
const {join, extname} = require("node:path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, '../data/inTrelloPhoto')); // Убедитесь, что папка существует
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + extname(file.originalname)); // Присвоение уникального имени
  }
});
const uploadInTrelloPhoto = multer({storage: storage});

const lifeHacksController = {
  async getAll(req, res) {
    try {
      const lists = await db.LifeHackList.findAll({
        include: [
          {
            model: db.LifeHackCard,
            include: [
              { model: db.User, as: "createdBy", attributes: ["id", "username"] },
              { model: db.User, as: "lastUpdatedBy", attributes: ["id", "username"] },
              { model: db.User, as: "assignedTo", attributes: ["id", "username"] },
              {
                model: db.InLifeHackPhoto,
                include: [
                  { model: db.User, as: "createdBy", attributes: ["id", "username"] }
                ]
              }
            ]
          },
          { model: db.User, as: "createdBy", attributes: ["id", "username"] },
          { model: db.User, as: "assignedTo", attributes: ["id", "username"] }
        ],
      });
      res.json(lists);
    } catch (e) {
      console.error("getAll error:", e);
      res.status(500).json({ error: e.message });
    }
  },
  async createList(req, res) {
    try {
      await db.sequelize.transaction(async (t) => {
        const newList = await db.LifeHackList.create({
          title: req.body.title,
          createdById: req.userId,
        }, {transaction: t});
        const newListToSend = await db.LifeHackList.findOne({
          where: { id: newList.id },
          include: [
            {
              model: db.LifeHackCard,
              include: [
                {model: db.User, as: 'createdBy', attributes: ['id', 'username']},
                {model: db.User, as: 'lastUpdatedBy', attributes: ['id', 'username']},
                {model: db.User, as: 'assignedTo', attributes: ['id', 'username']},
                {model: db.InLifeHackPhoto,
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
          ],
          transaction: t
        })
        res.status(201).json(newListToSend);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка створення списку' });
    }
  },
  async createCard(req, res) {
    try {
      await db.sequelize.transaction(async (t) => {
        const newCard = await db.LifeHackCard.create({ ...req.body, LifeHackListId: req.params.listId, createdById: req.userId, lastUpdatedById: req.userId }, {transaction: t});
        const newListToSend = await db.LifeHackCard.findOne({
          where: {id: newCard.id},
          include: [
            {model: db.User, as: 'createdBy', attributes: ['id', 'username']},
            {model: db.User, as: 'lastUpdatedBy', attributes: ['id', 'username']},
            {model: db.User, as: 'assignedTo', attributes: ['id', 'username']},
            {model: db.InLifeHackPhoto,
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
  },
  async deleteList(req, res) {
    try {
      const list = await db.LifeHackList.findByPk(req.params.id);
      if (!list) {
        return res.status(404).json({ message: 'Список не знайдено' });
      }
      await db.LifeHackCard.destroy({ where: { LifeHackListId: list.id } });
      await list.destroy();
      res.status(200).json({ message: 'Список видалено' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка сервера' });
    }
  },
  async deleteCard(req, res) {
    const { listId, cardId } = req.params;

    try {
      await db.sequelize.transaction(async (t) => {
        // Находим карточку по id и listId
        const card = await db.LifeHackCard.findOne({
          where: { id: cardId, listId },
          transaction: t
        });
        if (!card) {
          return res.status(404).json({ message: 'Картка не знайдена' });
        }

        // Находим все файлы, привязанные к карточке (предполагается наличие поля cardId)
        const attachedFiles = await db.InLifeHackPhoto.findAll({
          where: { cardId },
          transaction: t
        });

        // Итеративно удаляем каждый файл с диска
        for (const file of attachedFiles) {
          const filePath = join(__dirname, '../data/InLifeHackPhoto', file.photoLink);
          try {
            await fs.promises.unlink(filePath);
            console.log(`Файл ${file.photoLink} успішно видалено`);
          } catch (err) {
            console.error(`Помилка при видаленні файлу ${file.photoLink}:`, err);
            // Можно решить: либо прерывать транзакцию, либо логировать и продолжать
          }
        }

        // Удаляем записи файлов из базы данных
        await db.InLifeHackPhoto.destroy({
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
  },
  async updateContent(req, res) {
    try {
      const cardId = req.body.cardId;
      const newContent = req.body.newContent;
      await db.sequelize.transaction(async (t) => {
        await db.LifeHackCard.update(
            {content: newContent, lastUpdatedById: req.userId},
            {where: {id: cardId}, transaction: t}
        );
        const newCard = await db.LifeHackCard.findOne({
          where: {id: cardId},
          include: [
            {model: db.User, as: 'createdBy', attributes: ['id', 'username']},
            {model: db.User, as: 'lastUpdatedBy', attributes: ['id', 'username']},
            {model: db.User, as: 'assignedTo', attributes: ['id', 'username']},
            {model: db.InLifeHackPhoto,
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
  },
  async dragCard(req, res) {
    try {
      const cardId = req.body.cardId;
      const fromListId = req.body.fromListId;
      const toListId = req.body.toListId;
      const fromIndex = req.body.fromIndex;
      const toIndex = req.body.toIndex;
      await db.sequelize.transaction(async (t) => {
        await db.LifeHackCard.update(
            { LifeHackListId: toListId},
            { where: { id: cardId }, transaction: t }
        );
        const newListToSend = await db.LifeHackList.findAll({
          include: [
            {
              model: db.LifeHackCard,
              include: [
                {model: db.User, as: 'createdBy', attributes: ['id', 'username']},
                {model: db.User, as: 'lastUpdatedBy', attributes: ['id', 'username']},
                {model: db.User, as: 'assignedTo', attributes: ['id', 'username']},
                {model: db.InLifeHackPhoto,
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
  },
};

module.exports = lifeHacksController;
