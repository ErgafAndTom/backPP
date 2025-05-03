const {createEntity, readEntity, updateEntity, deleteEntity, getAllEntities} = require("./CRUDForEAVDB");
let InterfaceEAV = async function(req, res, body, pricesNew) {
    if(body.crud === "create") {
        let created = await createEntity("Entity", body.data);
        return created;
    }
    if(body.crud === "read") {
        let readed = await readEntity(body.data.id);
        return "ok";
    }
    if(body.crud === "update") {
        let updated = await updateEntity(body.data.id, body.data.entityAttributes);
        return "ok";
    }
    if(body.crud === "delete") {
        let deleted = await deleteEntity(body.data.id);
        return "ok";
    }
    if(body.crud === "readAll") {
        let entities = await getAllEntities();
        return entities;
    }
}

module.exports = {
    InterfaceEAV
}