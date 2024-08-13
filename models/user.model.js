import { DataTypes } from "sequelize";
import db from "../config/db.js";

const User = db.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender:{
        type:DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true    
    },
    phone:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    age:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DOB :{
        type :DataTypes.STRING,
        allowNull: false
    }
    
});

export default User;
