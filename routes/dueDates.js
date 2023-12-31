const DueDate = require("../models/DueDate");
const Contract = require("../models/Contract");
const router = require("express").Router();

//Add a new Due Date
router.post("/", async (req, res) => {
  const newDueDate = new DueDate(req.body);
  try {
    const savedDueDate = await newDueDate.save();
    res.status(200).json(savedDueDate);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Due Date
router.put("/:id", async (req, res) => {
  try {
    await DueDate.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Lend Successfully Updated");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Delete a Due Date
router.delete("/:id", async (req, res) => {
  try {
    await DueDate.findByIdAndDelete(req.params.id);
    res.status(200).json("Lend Successfully Deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Get Due Date
router.get("/:id", async (req, res) => {
  try {
    const dueDate = await DueDate.findById(req.params.id);
    res.status(200).json(dueDate);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Get All Due Dates
router.get("/", async (req, res) => {
  try {
    const dueDates = await DueDate.find();
    res.status(200).json(dueDates);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Get a specific due date
router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      throw new Error("Invalid date");
    }

    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    const day = parsedDate.getDate();

    const dueDates = await DueDate.find({
      dueDate: {
        $gte: new Date(year, month, day),
        $lt: new Date(year, month, day + 1),
      },
    });

    res.status(200).json(dueDates);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Get ongoing due dates
router.get("/ongoing/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      throw new Error("Invalid date");
    }

    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    const day = parsedDate.getDate();

    const dueDates = await DueDate.find({
      dueDate: {
        $gte: new Date(year, month, day),
      },
    });

    res.status(200).json(dueDates);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Get past due dates
router.get("/past/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      throw new Error("Invalid date");
    }

    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    const day = parsedDate.getDate();

    const dueDates = await DueDate.find({
      dueDate: {
        $lt: new Date(year, month, day),
      },
    });

    res.status(200).json(dueDates);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Get Unpaid Due Dates
router.get("/status/:status", async (req, res) => {
  try {
    const unpaidDues = await DueDate.find({
      status: req.params.status,
    });
    res.status(200).json(unpaidDues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unpaid due dates" });
  }
});

module.exports = router;
