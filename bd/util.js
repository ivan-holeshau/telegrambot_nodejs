const Commands = require("./model/command");
const { Model, DataTypes } = require('sequelize');

const body = {
    countCommands: async function(command) {
        let size = Commands.findAll({ where: { id: req.body.command }, raw: true });
        console.log(size);
    }
};



module.exports = body;