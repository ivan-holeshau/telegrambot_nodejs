const Sequelize = require("../config");

const { Model, DataTypes } = require('sequelize');

const sends = Sequelize.define("send_mesage", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {

    freezeTableName: true,
});

module.exports = sends;