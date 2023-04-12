const express = require("express");
const router = express.Router();
const { WaterBill, Invoice, AssocDue, Unit, Users, Rate, Balance } = require("../models");
const Decimal = require('decimal.js');


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
        return res.status(404).send('No Water Bill Data Found');
      }
      userFullNameWaterBill = units.waterBillTo; // assign the user id data to the userID variable

      //Get Invoice Number of Water Bill Payer
      const userWaterBillInvoice = await Users.findOne({
        where: { full_name: userFullNameWaterBill },
        attributes: ['invoice_no']
      });
  
      if (!userWaterBillInvoice) {
        return res.status(404).send('No Water Bill invoice Found');
      }
      userInvoiceWaterBill = userWaterBillInvoice.invoice_no //Assign the user invoice number to the userInvoice variable

      //Get AssocDue Bill To
      const unitAssoc = await Unit.findOne({
        where: { unit_no: unitNum },
        attributes: ['assocBillTo']
      });
  
      if (!unitAssoc) {
        return res.status(404).send('No Association Due invoice found');
      }
      userFullNameAssocDue = unitAssoc.assocBillTo; // assign the user id data to the userID variable

      //Get Invoice Number of AssocDue Bill Payer
      const userAssocDueInvoice = await Users.findOne({
        where: { full_name: userFullNameAssocDue },
        attributes: ['invoice_no']
      });
  
      if (!userWaterBillInvoice) {
        return res.status(404).send('assocUser not found');
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
    previous_reading,
    cur_read,
    waterBillTotal,
    assocDueTotal,
    ratePerSqm,
    ratePerCubic,
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
      rate: ratePerCubic,
      amount: waterBillTotal,
      invoice_no: invoiceWaterBillTo,
      billed_to: waterBillTo,
      due_date: thirtyDaysFromNowFormatted
    });
    const postAssocDue = new AssocDue({
      unit_no: unit_num,
      amount: assocDueTotal,
      rate: ratePerSqm,
      invoice_no: invoiceAssocBillTo,
      billed_to: assocBillTo,
      due_date: thirtyDaysFromNowFormatted
    })
    const [waterBill, assocDue] = await Promise.all([postWaterBill.save(), postAssocDue.save()]);
    
    //Balance
     // Fetch the current data from the balance table
    const currentBalance = await Balance.findOne({ where: { unit_no: unit_num } });
    
    // Calculate the new values for the balance table
    const waterBillTot = new Decimal(waterBillTotal);
    const assocDueTot = new Decimal(assocDueTotal);

    const newCurrent = waterBillTot.plus(assocDueTot);
    const thirtyDays = new Decimal(currentBalance.current);
    const sixtyDays = new Decimal(currentBalance.thirty_days);
    const ninetyDays = new Decimal(currentBalance.ninety_days).plus(currentBalance.sixty_days);
    const total = newCurrent.plus(thirtyDays).plus(sixtyDays).plus(ninetyDays);

    // Update the balance table with the new values
    await Balance.update({
      current: newCurrent.toNumber(),
      thirty_days: thirtyDays.toNumber(),
      sixty_days: sixtyDays.toNumber(),
      ninety_days: ninetyDays.toNumber(),
      total: total.toNumber()
    }, { where: { unit_no: unit_num } });

      //Add Invoice
      const postInvoice = new Invoice({
        waterbill_id: waterBill.id,
        assocdue_id: assocDue.id,
        unit_no: unit_num,
        invoice_date: todayFormatted,
        due_date: thirtyDaysFromNowFormatted,
      });
      await postInvoice.save();
      await Unit.update(
        { cur_read: cur_read },
        { where: { unit_no: unit_num } }
      );
      
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

// Get Invoice by Unit
router.post("/unitInvoiceData/:unit_no", async (req, res) => {
  const unitNum = req.params.unit_no;
  try {
    const invoiceByUnit = await Invoice.findOne({
      where: { unit_no: unitNum },
      include: [
        { model: WaterBill },
        { model: AssocDue },
      ],
      order: [['createdAt', 'DESC']] 
    }).catch((err) => {
      console.log(err);
    });

    const unitAccAging = await Balance.findOne({
      where: {unit_no: unitNum}
    }).catch((err) => {
      console.log(err);
    });

    //Total Charges Calculation
    const waterBillAmount = invoiceByUnit.WaterBill ? new Decimal(invoiceByUnit.WaterBill.amount) : new Decimal(0);
    const assocDueAmount = invoiceByUnit.AssocDue ? new Decimal(invoiceByUnit.AssocDue.amount) : new Decimal(0);
    const totalCharges = waterBillAmount.plus(assocDueAmount).toFixed(2);

    

    const waterBillData = {
      description: "**WATER BILL**" 
      + "\nReading Date: "+ invoiceByUnit.WaterBill.reading_date 
      +"\nRate: " + invoiceByUnit.WaterBill.rate 
      +"\nPrev. Reading: " + invoiceByUnit.WaterBill.prev_read 
      + "\nCurrent Reading: " + invoiceByUnit.WaterBill.cur_read
      +"\nBill to: " + invoiceByUnit.WaterBill.billed_to,
      readDate: invoiceByUnit.WaterBill.reading_date, 
      invoiceID: invoiceByUnit.WaterBill.invoice_no,
      amount: invoiceByUnit.WaterBill.amount,
      dueDate: invoiceByUnit.WaterBill.due_date
    } 

    const assocDueData = {
      invoice_no: invoiceByUnit.AssocDue.invoice_no,
      description: "**ASSOCIATION DUES**" 
      + "\nMonthly Assoc. Due: " + invoiceByUnit.AssocDue.amount
      + "\nBill to: " + invoiceByUnit.AssocDue.billed_to
      + "\nRate: " + invoiceByUnit.AssocDue.rate,
      rate: invoiceByUnit.AssocDue.rate,
      billed_to: invoiceByUnit.AssocDue.billed_to,
      amount: invoiceByUnit.AssocDue.amount,
      due_date: invoiceByUnit.AssocDue.due_date,
    }

    const accAgingData = {
      current: unitAccAging.current,
      thirty_days: unitAccAging.thirty_days,
      sixty_days: unitAccAging.sixty_days,
      ninety_days: unitAccAging.ninety_days,
      total: unitAccAging.total
    }


    res.json([{
      unit_no: invoiceByUnit.unit_no,
      totalCharges: totalCharges,
      waterBillData,
      assocDueData,
      accAgingData
    }]);
    console.log(totalCharges)
  } catch (error) {
    console.log(error)
  }
});


module.exports = router;
