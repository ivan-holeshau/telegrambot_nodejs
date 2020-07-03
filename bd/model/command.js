const Sequelize = require("../config");

const { Model, DataTypes } = require('sequelize');

const commands = Sequelize.define("commands", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = commands;