import cron from "node-cron";
import moment from "moment";
import { Op } from "sequelize";
import User from "../models/user.model.js";
import {
  sendAnniversaryNotification,
  sendGeneralWishesNotification,
} from "../notifications.js";
import Anniversary from "../models/anniversary.model.js";

export const createAnniversary = async (req, res) => {
  const { male_name, female_name, date, user_ids } = req.body;

  if (!male_name || !female_name || !date || !user_ids) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const obj = { male_name, female_name, date, user_ids };
  const createAnniversary = await Anniversary.create(obj);
  res.status(201).json(createAnniversary);
};

export const anniversaryTrigger = cron.schedule("*/10 * * * * *", async () => {
  try {
    const now = moment().utc();
    const currentDate = now.format("YYYY-MM-DD");
    console.log("Current date:", currentDate);

    // Fetch anniversary records that match today's date
    const anniversaryUsers = await Anniversary.findAll({
      where: {
        date: currentDate,
      },
    });
    console.log("Anniversary users:", anniversaryUsers);

    // Find all users
    const users = await User.findAll({
      attributes: ["id", "email", "name"],
    });

    // Create a map of user IDs for quick lookup
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Step 1: Send notifications to users celebrating their anniversary today
    const anniversaryUserIds = new Set(); // To store IDs of users celebrating today
    let anniversaryNames = [];

    for (let anniversary of anniversaryUsers) {
      const { user_ids, male_name, female_name } = anniversary.dataValues;
      const numericUserIds = Array.isArray(user_ids)
        ? user_ids
        : JSON.parse(user_ids);

      const matchingUsers = numericUserIds
        .map((userId) => userMap.get(userId))
        .filter((user) => user !== undefined);

      // Collect the IDs and names of users celebrating today
      matchingUsers.forEach((user) => {
        anniversaryUserIds.add(user.id);
        anniversaryNames.push(`${male_name} & ${female_name}`);
      });

      // Send anniversary notifications to matching users
      for (let user of matchingUsers) {
        console.log("Sending anniversary notification to:", user.email);
        await sendAnniversaryNotification(user, male_name, female_name);
      }
    }

    // Step 2: Identify and send notifications to users not celebrating today
    const nonAnniversaryUsers = users.filter(
      (user) => !anniversaryUserIds.has(user.id)
    );

    // Create a message with the names of the anniversary users
    const message = `Today is the wedding anniversary of ${anniversaryNames}. Don't forget to wish them a Happy Wedding Anniversary!`;

    for (let user of nonAnniversaryUsers) {
      console.log(`Sending general wishes to: ${user.email}`);
      await sendGeneralWishesNotification(user, message);
    }
  } catch (err) {
    console.log("Error:", err);
  }
});
