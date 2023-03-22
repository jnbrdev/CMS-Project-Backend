const express = require("express");
const router = express.Router();
const { WaterBill, Invoice, AssocDue, Unit, Users, Rate } = require("../models");




// Get Data Unit
router.post("/getUnitRateData/:unit_no", async (req, res) => {
    const unitNum = req.params.unit_no;
    let userFullNameWaterBill, 
        userInvoiceWaterBill, 
        userFullNameAssocDue, 
        userInvoiceAssocDue, 
        unitSize, unitMeter, prevReading,
        ratePerSqm, ratePerCubic, assocDueRate, discountRate, penaltyRate;
    
    try { 
      //Get Water Bill To
      const units = await Unit.findOne({
        where: { unit_no: unitNum },
        attributes: ['waterBillTo']
      });
  
      if (!units) {
        return res.status(404).send('User not found');
      }
      userFullNameWaterBill = units.waterBillTo; // assign the user id data to the userID variable

      //Get Invoice Number of Water Bill Payer
      const userWaterBillInvoice = await Users.findOne({
        where: { full_name: userFullNameWaterBill },
        attributes: ['invoice_no']
      });
  
      if (!userWaterBillInvoice) {
        return res.status(404).send('User not found');
      }
      userInvoiceWaterBill = userWaterBillInvoice.invoice_no //Assign the user invoice number to the userInvoice variable

      //Get AssocDue Bill To
      const unitAssoc = await Unit.findOne({
        where: { unit_no: unitNum },
        attributes: ['assocBillTo']
      });
  
      if (!unitAssoc) {
        return res.status(404).send('User not found');
      }
      userFullNameAssocDue = unitAssoc.assocBillTo; // assign the user id data to the userID variable

      //Get Invoice Number of AssocDue Bill Payer
      const userAssocDueInvoice = await Users.findOne({
        where: { full_name: userFullNameAssocDue },
        attributes: ['invoice_no']
      });
  
      if (!userWaterBillInvoice) {
        return res.status(404).send('User not found');
      }
      userInvoiceAssocDue = userAssocDueInvoice.invoice_no //Assign the user invoice number to the userInvoice variable




      //Get all Unit Info
      const unitInformation = await Unit.findAll({ where: { unit_no: unitNum } });
      if (unitInformation.length > 0) {
        const unitData = unitInformation[0];
        unitSize = unitData.unit_size;
        unitMeter = unitData.meter_no;
        prevReading = unitData.cur_read;
        console.error(unitMeter);
      } else {
        // handle case where no unit information was found
      }

      //Get all Rate Info
      const rateInformation = await Rate.findAll();
      if (rateInformation.length > 0) {
        const rateData = rateInformation[0];
        ratePerSqm = rateData.ratePerSqm;
        discountRate = rateData.discountRate;
        ratePerCubic = rateData.ratePerCubic;
        penaltyRate = rateData.penaltyRate;
        assocDueRate = rateData.assocDueRate;
        console.error(unitMeter);
      } else {
        // handle case where no unit information was found
      }
      
    console.error(unitMeter);
    } catch (err) {
      console.error(err);
      return res.status(500).send('An error occurred while retrieving user data');
    }
    res.json({
        unit_num: unitNum,
        waterBillTo: userFullNameWaterBill, 
        invoiceWaterBillTo: userInvoiceWaterBill, 
        assocBillTo: userFullNameAssocDue,
        invoiceAssocBillTo: userInvoiceAssocDue,
        unit_size: unitSize,
        meter_no: unitMeter,
        previous_reading: prevReading,
        ratePerSqm: ratePerSqm,
        discountRate: discountRate,
        ratePerCubic: ratePerCubic,
        penaltyRate: penaltyRate,
        assocDueRate: assocDueRate,  
    });
      
  });

// Add Water Bill and Association Due
router.post("/addBill", async (req, res) => {
  const {  unit_num,
    waterBillTo,
    invoiceWaterBillTo,
    assocBillTo,
    invoiceAssocBillTo,
    unit_size,
    meter_no,
    previous_reading,
    cur_read,
    ratePerSqm,
    discountRate,
    ratePerCubic,
    penaltyRate,
    assocDueRate,
    waterBillTotal,
    assocDueTotal,
    reading_date} = req.body;
  try {
    const today = new Date(); // Today's date
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); // Date 30 days from now

    const todayFormatted = today.toISOString().slice(0, 10);
    const thirtyDaysFromNowFormatted = thirtyDaysFromNow.toISOString().slice(0, 10);
  
    const postWaterBill = new WaterBill({
      unit_no: unit_num,
      prev_read: previous_reading,
      cur_read: cur_read,
      reading_date: reading_date,
      amount: waterBillTotal,
      invoice_no: invoiceWaterBillTo,
      billed_to: waterBillTo,
      due_date: thirtyDaysFromNowFormatted
    });
    const postAssocDue = new AssocDue({
      unit_no: unit_num,
      amount: assocDueTotal,
      invoice_no: invoiceAssocBillTo,
      billed_to: assocBillTo,
      due_date: thirtyDaysFromNowFormatted
    })
    await postWaterBill.save();
    await postAssocDue.save();
    res.json({ message: "Service Added Succesfully" });
    console.log(postAssocDue);
    console.log(postWaterBill);
  } catch (err) {console.log(err)}
});

// Get All WaterBill
router.post("/getAllWaterBill", async (req, res) => {
  const listOfWaterBill = await WaterBill.findAll();
  res.json(listOfWaterBill);
});

// Get All Association Due
router.post("/getAllAssocDue", async (req, res) => {
  const listOfAssocDue = await AssocDue.findAll();
  res.json(listOfAssocDue);
});
module.exports = router;
