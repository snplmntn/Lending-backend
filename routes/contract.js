const Contract = require("../models/Contract");
const DueDate = require("../models/DueDate");
const router = require("express").Router();

//Add a new Contract
router.post("/", async (req, res) => {
  const newContract = new Contract(req.body);
  try {
    const savedContract = await newContract.save();
    res.status(200).json(savedContract);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Contract
router.put("/:id", async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const contract = await Contract.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Lend Successfully Updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not authorized to do this operation");
  }
});

// Delete a Contract
router.delete("/:id", async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Contract.findByIdAndDelete(req.params.id);
      res.status(200).json("Lend Successfully Deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not authorized to do this operation");
  }
});

//Get Contract
router.get("/:id", async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    // const { letter, proof, ...other } = contract._doc;
    res.status(200).json(contract);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Get All Contracts
router.get("/", async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.status(200).json(contracts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
