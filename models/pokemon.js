const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Pokemon extends Model {};

Pokemon.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pokedex_id: {
            type: DataTypes.INTEGER
        },
        variant: {
            type: DataTypes.STRING(10),
        },
        variant_name: {
            type: DataTypes.STRING
        },
        type1: {
            type: DataTypes.STRING
        },
        type2: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        underscored: true,
        freezeTableName: true,
        modelName: 'pokemon', 
    }
);

module.exports = Pokemon;