const express = require("express");
const router = express.Router();
const { AssocDue, WaterBill, Invoice } = require("../models");
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { Sequelize } = require('sequelize');
const Decimal = require('decimal.js');
// Billings 
const waterBillData = (waterBill) => {
  return waterBill.map((bill) => ({
    id: bill.id,
    trans_no: bill.trans_no,
    description: "**WATER BILL**" 
      + "\nReading Date: "+ bill.reading_date 
      +"\nRate: " + bill.rate 
      +"\nPrev. Reading: " + bill.prev_read 
      + "\nCurrent Reading: " + bill.cur_read
      +"\nBill to: " + bill.billed_to,
    readDate: bill.reading_date, 
    invoiceID: bill.invoice_no,
    amount: bill.amount,
    due_date: bill.due_date,
    unit_no: bill.unit_no,
    bill_type: bill.bill_type,
    status: bill.status
  }));
};

const assocDueData = (assocDue) => {
  return assocDue.map((due) => ({
    id: due.id,
    trans_no: due.trans_no,
    invoice_no: due.invoice_no,
    description: "**ASSOCIATION DUES**" 
      + "\nMonthly Assoc. Due: " + due.amount
      + "\nBill to: " + due.billed_to
      + "\nRate: " + due.rate,
    rate: due.rate,
    billed_to: due.billed_to,
    amount: due.amount,
    due_date: due.due_date,
    unit_no: due.unit_no,
    bill_type: due.bill_type,
    status: due.status
  }));
};

router.post("/getBillingsUnitOwner/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await Users.findOne({where: {email: email}})
    const userFname = user.full_name
    const waterBill = await WaterBill.findAll({
      where: {billed_to: userFname, status: "Unpaid"},
      attributes: ['id', 'unit_no', 'invoice_no', 'billed_to','trans_no', 'bill_type', 'prev_read', 'cur_read', 'reading_date', 'due_date', 'rate', 'status', 'amount', [Sequelize.fn('MAX', Sequelize.col('createdAt')), 'latest_date']],
      group: ['unit_no'],
      order: [['latest_date', 'DESC']]
    });

    const assocDue = await AssocDue.findAll({
      where: {billed_to: userFname, status: "Unpaid"},
      attributes: ['id', 'unit_no', 'invoice_no', 'billed_to', 'trans_no', 'bill_type', 'due_date', 'rate', 'status', 'amount', [Sequelize.fn('MAX', Sequelize.col('createdAt')), 'latest_date']],
      group: ['unit_no'],
      order: [['createdAt', 'DESC']]
    });
    
    const response = {
      waterBillData: waterBillData(waterBill),
      assocDueData: assocDueData(assocDue),
    };

    res.json(response)
  } catch (error) {
    console.log(error)
  }
});

// PAYMENT endpoint
router.post("/payment", async (req, res) => {
  const { email, trans_no, bill_type} = req.body;

  try {
    
    if(bill_type === "Water Bill"){
      const user = await Users.findOne({where: {email: email}})
      const name = user.full_name
      const bal = new Decimal(user.acc_balance)
      const watBill = await WaterBill.findOne({where: {billed_to: name, trans_no: trans_no}})
      const amt = new Decimal(watBill.amount)
      const newAccBalance = bal - amt //Get New Account Balance
      console.log(newAccBalance)
      const newStatus = "Paid"
      //Update
      await Users.update({acc_balance: newAccBalance}, { where: { email: email } });
      await WaterBill.update({status: newStatus}, { where: { billed_to: name, trans_no: trans_no } });

      res.json({message: "Payment Successful!"})
    }else if(bill_type === "Association Due"){
      const user = await Users.findOne({where: {email: email}})
      const name = user.full_name
      const bal = new Decimal(user.acc_balance)
      const assocBill = await AssocDue.findOne({where: {billed_to: name, trans_no: trans_no}})
      const amt = new Decimal(assocBill.amount)
      const newAccBalance = bal - amt //Get New Account Balance
      const newStatus = "Paid"
      //Update
      await Users.update({acc_balance: newAccBalance}, { where: { email: email } });
      await AssocDue.update({status: newStatus}, { where: { billed_to: name, trans_no: trans_no } });

      res.json({message: "Payment Successful!"})
    }
    
  } catch (error) {
    console.log(error)
  }
});
module.exports = router;
