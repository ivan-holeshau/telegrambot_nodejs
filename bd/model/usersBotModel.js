const Sequelize = require("../config");

const { Model, DataTypes } = require('sequelize');

const users = Sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    phone: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    active: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {

    freezeTableName: true,
});

module.exports = users;