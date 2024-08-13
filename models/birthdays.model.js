import { DataTypes } from "sequelize";
import db from "../config/db.js";


const birthdays = db.define('birthdays',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    birthday:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default birthdays;