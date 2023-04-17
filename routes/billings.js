const express = require("express");
const router = express.Router();
const { AssocDue, WaterBill, Invoice } = require("../models");
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
// Get All Guest
router.post("/getBillingsUnitOwner/:email", async (req, res) => {
    const email = req.params.email;
  try {
    const user = await Users.findOne({where: {email: email}})
    const userFname = user.full_name
    const waterBill = await WaterBill.findOne({
        where: {billed_to: userFname },
        order: [['createdAt', 'DESC']] 
      }).catch((err) => {
        console.log(err);
      });

    const assocDue = await AssocDue.findOne({
        where: {billed_to: userFname },
        order: [['createdAt', 'DESC']] 
      }).catch((err) => {
        console.log(err);
      });
    if (waterBill !== null && assocDue !== null) {
        const waterBillData = {
            description: "**WATER BILL**" 
            + "\nReading Date: "+ waterBill.reading_date 
            +"\nRate: " + waterBill.rate 
            +"\nPrev. Reading: " + waterBill.prev_read 
            + "\nCurrent Reading: " + waterBill.cur_read
            +"\nBill to: " + waterBill.billed_to,
            readDate: waterBill.reading_date, 
            invoiceID: waterBill.invoice_no,
            amount: waterBill.amount,
            dueDate: waterBill.due_date
          } 
      
          const assocDueData = {
            invoice_no: assocDue.invoice_no,
            description: "**ASSOCIATION DUES**" 
            + "\nMonthly Assoc. Due: " + assocDue.amount
            + "\nBill to: " + assocDue.billed_to
            + "\nRate: " + assocDue.rate,
            rate: assocDue.rate,
            billed_to: assocDue.billed_to,
            amount: assocDue.amount,
            due_date: assocDue.due_date,
          }
          res.json([{waterBillData, assocDueData}])
    }else if(waterBill !== null && assocDue === null){
        const waterBillData = {
            description: "**WATER BILL**" 
            + "\nReading Date: "+ waterBill.reading_date 
            +"\nRate: " + waterBill.rate 
            +"\nPrev. Reading: " + waterBill.prev_read 
            + "\nCurrent Reading: " + waterBill.cur_read
            +"\nBill to: " + waterBill.billed_to,
            readDate: waterBill.reading_date, 
            invoiceID: waterBill.invoice_no,
            amount: waterBill.amount,
            dueDate: waterBill.due_date
          } 
          res.json([{waterBillData}])
    }else if(waterBill === null && assocDue !== null){
        const assocDueData = {
            invoice_no: assocDue.invoice_no,
            description: "**ASSOCIATION DUES**" 
            + "\nMonthly Assoc. Due: " + assocDue.amount
            + "\nBill to: " + assocDue.billed_to
            + "\nRate: " + assocDue.rate,
            rate: assocDue.rate,
            billed_to: assocDue.billed_to,
            amount: assocDue.amount,
            due_date: assocDue.due_date,
          }
          res.json([{assocDueData}])
    }else if(waterBill === null && assocDue === null){
        res.json({message: "No Current Billing"})
    }
      

    
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
