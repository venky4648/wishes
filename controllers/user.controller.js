import User from "../models/user.model.js";
import Logger from "../config/logger.js";
import { upload } from "../notifications.js";
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';// Ensure the correct path

export const createUser = async (req, res) => {
    const { name, gender, age, DOB, email, phone } = req.body;
    const user_obj = { name, gender, age, DOB, email, phone };
    

    // Ensure all fields are present
    if (!name || !gender || !age || !DOB || !email || !phone) {
        Logger.info("Fields are missing", { service: 'user_creation' });
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if a user with the same email already exists
        const checkUser = await User.findAll({ where: { email: email } });
        if (checkUser.length > 0) {
            return res.status(400).json({ message: "User already exists with this email" });
        }
        const user = await User.create(user_obj);
        Logger.info("User created successfully");
        return res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        Logger.error("Failed to create user", { service: 'user_creation', error: error.message });
        return res.status(500).json({ message: "Failed to create user" });
    }
};
//update user 

export const updateUser = async (req,res) => {
    const { email, name, gender, age, phone } = req.body;
    const update_obj={ email, name, gender, age, phone } ;
    
    try {
        const user = await User.findOne({ where: { email: email } });
        if(!user) {
            return res.status(404).send({message: 'User not found'});
        }
        const updatedata = await user.update({update_obj});
        return res.status(200).send({message: "updated successfully",updatedata});
        
    } catch (error) {
        return res.status(500).send({message: 'Error updating user'});
    }

}

// getall user

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        Logger.error("Failed to get all users", { service: 'user_retrieval', error: error.message });
        return res.status(500).json({ message: "Failed to get all users" });
    }
};




export const uploadUsers = async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        Logger.error("File upload error", { service: 'user_creation', error: err.message });
        return res.status(400).json({ message: err.message });
      }

      // Check if file is provided
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // File path
      const filePath = path.join(__dirname, '../uploads', req.file.filename);

      // Read and parse the CSV file
      const users = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          // Assuming CSV has columns: name, gender, age, DOB, email, phone
          users.push({
            name: row.name,
            gender: row.gender,
            age: row.age,
            DOB: row.DOB,
            email: row.email,
            phone: row.phone
          });
        })
        .on('end', async () => {
          try {
            for (const userData of users) {
              const { name, gender, age, DOB, email, phone } = userData;
              
              // Ensure all fields are present
              if (!name || !gender || !age || !DOB || !email || !phone) {
                Logger.info("Missing fields in CSV", { service: 'user_creation' });
                continue;
              }

              // Check if a user with the same email already exists
              const checkUser = await User.findAll({ where: { email: email } });
              if (checkUser.length > 0) {
                Logger.info(`User already exists with this email: ${email}`, { service: 'user_creation' });
                continue;
              }

              await User.create(userData);
            }

            // Clean up the file
            fs.unlinkSync(filePath);

            Logger.info("Users created successfully from file");
            res.status(201).json({ message: "Users created successfully" });
          } catch (error) {
            Logger.error("Error processing users from file", { service: 'user_creation', error: error.message });
            res.status(500).json({ message: "Failed to create users from file" });
          }
        });
    });
  } catch (error) {
    Logger.error("Error uploading users", { service: 'user_creation', error: error.message });
    res.status(500).json({ message: "Failed to upload users" });
  }
};


