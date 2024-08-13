import { Sequelize } from "sequelize";

const db = new Sequelize("wishes","postgres","7893",{
    host: "localhost",
    dialect: "postgres",
    schema:"public",
    port:"5432"
})

export default db ;