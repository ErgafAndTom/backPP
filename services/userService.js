const db = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("../back/modelDB");

exports.register = async ({ username, password }) => {
    const hash = bcrypt.hashSync(password, 8);
    const user = await db.User.create({ username, password: hash });
    return { message: 'Пользователь создан', user };
};

exports.create = async (formValues) => {
    return await db.sequelize.transaction(async (t) => {
        const user = await db.User.create(formValues, { transaction: t });
        return user;
    });
};

exports.registerInOrder = async ({ thisOrderId, username, email, phoneNumber, telegram, firstName, lastName, familyName }) => {
    return await db.sequelize.transaction(async (t) => {
        const user = await db.User.create({ username, email, phoneNumber, telegram, firstName, lastName, familyName }, { transaction: t });
        await db.Order.update({ userId: user.dataValues.id }, { where: { id: thisOrderId }, transaction: t });
        const order = await db.Order.findOne({
            where: { id: thisOrderId },
            include: [
                { model: db.OrderUnit, as: 'OrderUnits', include: [{ model: db.OrderUnitUnit, as: 'OrderUnitUnits' }] },
                { model: db.User, as: 'User', attributes: ['username', 'id', 'firstName', 'email', 'phoneNumber', 'discount', 'telegram', 'photoLink'] }
            ]
        });
        if (!order) throw new Error('Заказ не найден после обновления');
        return order;
    });
};

exports.onlyOneFieldUpdate = async ({ currentPage, inPageCount, columnName, search, tablePosition, input, id }) => {
    const updatedFields = { [tablePosition]: input };
    const [rowsUpdated] = await db.User.update(updatedFields, { where: { id } });
    if (rowsUpdated !== 1) throw new Error('Обновлено 0 rows');
    const searchString = `%${search}%`;
    const fieldsForSearch = Object.keys(db.User.rawAttributes);
    const SearchConditions = fieldsForSearch.map(field => ({ [field]: { [Op.like]: searchString } }));
    const materials = await db.User.findAndCountAll({
        offset: (currentPage - 1) * inPageCount,
        limit: inPageCount,
        where: { [Op.or]: SearchConditions },
        order: [[columnName.column, columnName.reverse ? 'DESC' : 'ASC']]
    });
    materials.metadata = fieldsForSearch;
    return materials;
};

exports.getUserInfo = async ({ username, password }) => {
    const hash = bcrypt.hashSync(password, 8);
    const user = await db.User.create({ username, password: hash });
    return { message: 'Пользователь создан', user };
};

exports.getAllUsers = async ({ currentPage, inPageCount, columnName, search }) => {
    const searchString = `%${search}%`;
    const fieldsForSearch = Object.keys(db.User.rawAttributes);
    const SearchConditions = fieldsForSearch.map(field => ({ [field]: { [Op.like]: searchString } }));
    const users = await db.User.findAndCountAll({
        offset: (currentPage - 1) * inPageCount,
        limit: inPageCount,
        where: { [Op.or]: SearchConditions },
        order: [[columnName.column, columnName.reverse ? 'DESC' : 'ASC']]
    });
    users.metadata = fieldsForSearch;
    return users;
};