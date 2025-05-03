const db = require("../models");

const lifeHacksService = {
  async getAll() {
    return await db.LifeHack.findAll();
  },
  async create(data) {
    return await db.LifeHack.create(data);
  },
  async delete(id, user) {
    if (user.role !== 'admin') throw new Error("Unauthorized");
    const item = await db.LifeHack.findByPk(id);
    if (!item) throw new Error("Not found");
    await item.destroy();
    return true;
  }
};

module.exports = lifeHacksService;
