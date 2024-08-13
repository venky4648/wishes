import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Anniversary = db.define('anniversary',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_ids: {
        type:DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
    },
    male_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    female_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
});

export default Anniversary; 