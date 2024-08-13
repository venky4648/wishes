import cron from "node-cron";
import moment from "moment";
import { Op } from 'sequelize';
import User from "../models/user.model.js";
import Logger from "../config/logger.js";
import { sendBirthdayNotification,sendOtherBirthdayNotification } from "../notifications.js";


export const birthdayTrigger = cron.schedule("0 * 9 * *", async () => {
    try {
      const now = moment().utc();
      const currentDate = now.format("MM-DD");
  
      const birthdayUsers = await User.findAll({
        where: {
          DOB: {
            [Op.like]: `%${currentDate}%`
          }
        }
      });

      console.log(birthdayUsers)
  
      if (birthdayUsers.length > 0) {
        const otherUsers = await User.findAll({
          where: {
            DOB: {
              [Op.notLike]: `%${currentDate}%`
            }
          }
        });
  
        for (let birthdayUser of birthdayUsers) {
          await sendBirthdayNotification(birthdayUser);
          for (let otherUser of otherUsers) {
            await sendOtherBirthdayNotification(birthdayUser, otherUser);
          }
        }
      } else {
        console.log("No birthdays found for today.");
      }
    } catch (error) {
      Logger.error("Birthday cron job failed", {
        service: "birthday_cron_job",
        error: error.message,
        stack: error.stack // Add stack trace for more details
      });
    }
  });
  