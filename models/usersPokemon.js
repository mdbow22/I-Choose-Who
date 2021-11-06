const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UsersPokemon extends Model {};

UsersPokemon.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        pokemon_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'pokemon',
                key: 'id'
            }
        },
        favorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        }
    },
    {
        sequelize,
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        modelName: 'users_pokemon',
    }
);

module.exports = UsersPokemon;