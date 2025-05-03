const {Entity, Attribute, Value, sequelize, Op} = require("../back/ModelEAVDB");


let createEntity = async function (entityName, attributes) {
    const entity = await Entity.create({Entity_Name: entityName});
    const attributeValues = Object.entries(attributes).map(async ([key, value]) => {
        console.log(key);
        console.log(value);
        const [attribute, created] = await Attribute.findOrCreate({
            where: {Attribute_Name: value.attributeName}
        });
        return Value.create({
            Entity_ID: entity.Entity_ID,
            Attribute_ID: attribute.Attribute_ID,
            Value: value.attributeValue
        });
    });
    await Promise.all(attributeValues);
    entity.dataValues.attributeValues = attributes;
    return entity;
}

let readEntity = async function (entityId) {
    const entity = await Entity.findByPk(entityId, {
        include: {
            model: Value,
            include: [{
                model: Attribute
            }]
        }
    });
    if (!entity) {
        return null;
    }
    return entity.Values.reduce((acc, item) => {
        acc[item.Attribute.name] = item.value;
        return acc;
    }, {name: entity.name});
}

let updateEntity = async function (entityId, newAttributes) {
    const values = await Value.findAll({
        where: {entityId},
        include: [Attribute]
    });
    for (const value of values) {
        if (newAttributes.hasOwnProperty(value.Attribute.name)) {
            value.value = newAttributes[value.Attribute.name];
            await value.save();
        }
    }
}

let deleteEntity = async function (entityId) {
    await Value.destroy({where: {entityId}});
    await Entity.destroy({where: {id: entityId}});
}

let getAllEntities = async function () {
    const entities = await Entity.findAll({
        include: {
            model: Value,
            include: [{
                model: Attribute
            }]
        }
    });
    return entities.map(entity => {
        // Редукування значень атрибутів до одного об'єкта
        entity.dataValues.attributeValues = []
        for (let i = 0; i < entity.values.length; i++) {
            let details = entity.values.reduce((acc, item) => {
                console.log(item.dataValues);
                // acc[item.dataValues.attribute.dataValues.Attribute_Name] = item.dataValues.Value;
                acc[item.dataValues.attribute.dataValues.Attribute_Name] = item.dataValues.Value;
                // acc["attributeName"] = item.dataValues.attribute.dataValues.Attribute_Name;
                // acc["attributeValue"] = item.dataValues.Value;
                return acc;
            }, {});
            entity.dataValues.attributeValues.push(details)
        }
        // details.name = entity.name;  // Збереження імені ентіті, якщо потрібно
        // entity.dataValues.attributeValues = details;
        return entity;
    });
}

module.exports = {
    createEntity,
    readEntity,
    updateEntity,
    deleteEntity,
    getAllEntities
}