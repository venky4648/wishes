import express from "express";
import {createUser,updateUser,getAllUsers }from"../controllers/user.controller.js"

const router = express.Router();

router.post("/create-user", createUser);
router.post("/update-user", updateUser);

router.get("/get-all-users", getAllUsers);

export default router;
