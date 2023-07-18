// libraries
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cron = require("node-cron");
const moment = require("moment-timezone");
const DueDate = require("./models/DueDate");

// Routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const contractRoute = require("./routes/contract");
const dueDateRoute = require("./routes/dueDates");
const uploadRoute = require("./routes/upload");

// Initialization
const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Connected to MongoDB");
});

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "public/contracts")));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/contract", contractRoute);
app.use("/api/dueDates", dueDateRoute);
app.use("/api/upload", uploadRoute);

app.listen(8080, () => {
  console.log("Server Started");
});

// Run the background task at 12am in Asia/Manila time zone
cron.schedule("0 */12 * * *", async () => {
  const now = moment().tz("Asia/Manila");
  try {
    const currentDate = new Date();
    const overdueDueDates = await DueDate.find({
      dueDate: { $lt: currentDate },
      status: { $ne: 2, $ne: 1 },
    });

    for (const dueDate of overdueDueDates) {
      dueDate.status = 2;
      await dueDate.save();
    }

    console.log("Status updated successfully.");
  } catch (err) {
    console.error("An error occurred while updating the status:", err);
  }
});
