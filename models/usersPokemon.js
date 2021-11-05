const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UsersPokemon extends Model {};

UsersPokemon.init(
    {
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