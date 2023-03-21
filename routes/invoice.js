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



module.exports = router;
