import express from "express";
import db from "./config/db.js";
import bodyparser from"body-parser";
import router from './routes/user.route.js';
import { birthdayTrigger } from "./controllers/birthday.controller.js";
;import anniversaryRoute from "./routes/anniversary.route.js";
import { anniversaryTrigger } from "./controllers/anniversary.controller.js";


const port =3000;

const app = express();

app.use (express.json());

app.use("/user",router);

app.use("/anniversary", anniversaryRoute);


// birthdayTrigger.start();

db.authenticate()
   .then(()=>console.log('Database connected...')) 
   db.sync()
   .catch(err=>console.log(err));

birthdayTrigger.start();
anniversaryTrigger.start();
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    
});