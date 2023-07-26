// libraries
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const DueDate = require("./models/DueDate");
const Contract = require("./models/Contract");

// Routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const contractRoute = require("./routes/contract");
const dueDateRoute = require("./routes/dueDates");
const uploadRoute = require("./routes/upload");

// Initialization
const app = express();
dotenv.config();
const port = 8080;

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/contract", contractRoute);
app.use("/api/dueDates", dueDateRoute);
app.use("/api/upload", uploadRoute);

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("Connected to MongoDB");
});

// ...

// Function to update due date statuses
const updateDueDateStatuses = async () => {
  const currentDate = new Date();
  try {
    const overdueDueDates = await DueDate.find({
      dueDate: { $lt: currentDate },
      status: { $ne: 2, $ne: 1 },
    });

    for (const dueDate of overdueDueDates) {
      dueDate.status = 2;
      await dueDate.save();
    }

    console.log("Due Dates Status Updated Successfully.");
  } catch (err) {
    console.error("An error occurred while updating the status:", err);
  }

  try {
    const overdueContracts = await Contract.find({
      finalDate: { $lt: currentDate },
      status: { $ne: 2, $ne: 1 },
    });

    for (const finalDate of overdueContracts) {
      finalDate.status = 2;
      await finalDate.save();
    }

    console.log("Contracts Status Updated Successfully.");
  } catch (err) {
    console.error("An error occurred while updating the status:", err);
  }
};

// Start the server and update due date statuses
app.listen(port, async () => {
  console.log("Server Started " + port);

  // Update due date statuses when the server starts
  await updateDueDateStatuses();
});
