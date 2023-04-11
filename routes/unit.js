const express = require("express");
const router = express.Router();
const { Unit } = require("../models");
const { Users } = require("../models");

// Get All Unit
router.post("/getAllUnit", async (req, res) => {
  const listOfUnit = await Unit.findAll();
  res.json(listOfUnit);
});

// Get Active Unit
router.get("/getVacantUnit", async (req, res) => {
  let status = "Vacant";
  let getVacantUnit = await Unit.findAll({ where: { status: status } });
  res.json(getVacantUnit);
});

//Get One Unit
router.get("/getOneUnit/:id", async (req, res) => {
  let unit_no = req.params.unit_no;
  let getOneUnit = await Unit.findOne({ where: { unit_no: unit_no } });
  res.json(getOneUnit);
});

// Add Unit
router.post("/addUnit", async (req, res) => {
  const {
    unit_no,
    unit_owner,
    unit_tower,
    unit_floor,
    unit_size,
    occupied_by,
    status,
  } = req.body;
  try {
    const alreadyExistUnit = await Unit.findOne({ where: { unit_no } }).catch(
      (err) => {
        console.log(err);
      }
    );

    if (alreadyExistUnit) {
      return res.json({ message: "Unit already Exist! " });
    }

    /* FOR UPDATE - use later
    const unitOwnerName = await Users.findOne({
      where: { full_name: unit_owner },
    });

    if (!unitOwnerName) {
      return res.json({ message: "User does not exist!" });
    }

    const userId = unitOwnerName.id;*/
    //Add  Balance
    const postBal = new Balance({
        unit_no: unit_no,
        total: 0,
        thirty_days: 0,
        sixty_days: 0,
        ninety_days: 0,
    })

    


    const postUnit = new Unit({
      unit_no,
      unit_owner,
      unit_tower,
      unit_floor,
      unit_size,
      occupied_by,
      status,
    });
    await postUnit.save();
    await postBal.save();
    res.json({ message: "Unit Added Succesfully" });
    console.log(postUnit);
  } catch (err) {}
});

// Update Unit
router.put("/updateUnit/:unitNo", async (req, res) => {
  
  try {
    const unit_no = req.params.unitNo;
  const updateUnit = await Unit.update(req.body, { where: { unit_no: unit_no } });
  res.json(updateUnit);
  
  } catch (error) {
    res.json(error)
  }
});

// Delete Unit
router.delete("/deleteUnit/:id", async (req, res) => {
  let id = req.params.id;
  const delUnit = await Unit.destroy({ where: { id: id } });
  res.json(delUnit);
});

module.exports = router;
