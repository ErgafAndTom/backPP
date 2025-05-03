const {Op} = require("../../modelDB");

async function adminProducts(req, res, body, Files, Sessions, Users, Orders, Actions, Services, Devices, Materials, Product, ProductUnit, sequelize) {
    try {
        if (body.method === "getAll") {
            console.log(body.search);
            let searchString = `%${body.search}%`;
            let fieldsForSearch = Object.keys(Product.rawAttributes);
            let SearchConditions = fieldsForSearch.map(field => ({[field]: {[Op.like]: searchString}}));
            let products = await Product.findAndCountAll({
                include: [{model: ProductUnit, as: 'productunits'}],
                where: {
                    [Op.or]: SearchConditions
                }
            });
            products.metadataProduct = Object.keys(Product.rawAttributes)
            products.metadataProductUnit = Object.keys(ProductUnit.rawAttributes)
            res.send(products);
        }
        if (body.method === "addNew") {
            const newProduct = await Product.create({
                name: body.productName,
                newField1: body.newField1,
                x: body.x,
                y: body.y,
                type: body.type
            });
            for (let i = 0; i < body.productUnits.length; i++) {
                let newProductUnit = await ProductUnit.create({
                    quantity: body.productUnits[i].unitQuantity,
                    name: body.productUnits[i].unitName,
                    idInStorageUnit: body.productUnits[i].idInStorageUnit,
                    newField1: body.productUnits[i].newField1,
                    xInStorage: body.productUnits[i].xInStorage,
                    yInStorage: body.productUnits[i].yInStorage,
                });
                await newProduct.addProductunits(newProductUnit);  // Modified code
            }
            let products = await Product.findAndCountAll({
                include: [{model: ProductUnit, as: 'productunits'}]
            });
            products.metadataProduct = Object.keys(Product.rawAttributes)
            products.metadataProductUnit = Object.keys(ProductUnit.rawAttributes)
            res.send(products);
        }
        if (body.method === "deleteOne") {
            await Product.destroy({
                where: {
                    id: body.id
                }
            });
            let products = await Product.findAndCountAll({
                include: [{model: ProductUnit, as: 'productunits'}]
            });
            products.metadataProduct = Object.keys(Product.rawAttributes)
            products.metadataProductUnit = Object.keys(ProductUnit.rawAttributes)
            res.send(products);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({message: 'Internal Server Error'});
    }
}

module.exports = {
    adminProducts
}