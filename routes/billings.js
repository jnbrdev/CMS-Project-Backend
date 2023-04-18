const express = require("express");
const router = express.Router();
const { AssocDue, WaterBill, Invoice } = require("../models");
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const { Sequelize } = require('sequelize');
// Billings 
const waterBillData = (waterBill) => {
  return waterBill.map((bill) => ({
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
    status: bill.status
  }));
};

const assocDueData = (assocDue) => {
  return assocDue.map((due) => ({
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
      attributes: ['id', 'unit_no', 'invoice_no', 'billed_to', 'prev_read', 'cur_read', 'reading_date', 'due_date', 'rate', 'status', 'amount', [Sequelize.fn('MAX', Sequelize.col('createdAt')), 'latest_date']],
      group: ['unit_no'],
      order: [['latest_date', 'DESC']]
    });

    const assocDue = await AssocDue.findAll({
      where: {billed_to: userFname, status: "Unpaid"},
      attributes: ['id', 'unit_no', 'invoice_no', 'billed_to', 'due_date', 'rate', 'status', 'amount', [Sequelize.fn('MAX', Sequelize.col('createdAt')), 'latest_date']],
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


module.exports = router;
