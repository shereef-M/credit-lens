const express = require("express");
const axios = require("axios");
const Application = require("../models/Application");

const router = express.Router();

// Create a new application and score it
router.post("/", async (req, res) => {
  try {
    const {
      applicantName,
      loanamount,
      totaldue,
      termdays,
      prev_loan_count,
      avg_days_early_late,
      max_days_late,
      avg_loanamount,
      was_referred,
      has_demographics,
      longitude_gps,
      latitude_gps,
      bank_account_type,
      bank_name_clients,
      employment_status_clients,
    } = req.body;

    const mlResponse = await axios.post(`${process.env.ML_API_URL}/predict`, {
      loanamount,
      totaldue,
      termdays,
      prev_loan_count,
      avg_days_early_late,
      max_days_late,
      avg_loanamount,
      was_referred,
      has_demographics,
      longitude_gps,
      latitude_gps,
      bank_account_type,
      bank_name_clients,
      employment_status_clients,
    });

    const application = new Application({
      applicantName,
      loanamount,
      totaldue,
      termdays,
      prev_loan_count,
      avg_days_early_late,
      max_days_late,
      avg_loanamount,
      was_referred,
      has_demographics,
      longitude_gps,
      latitude_gps,
      bank_account_type,
      bank_name_clients,
      employment_status_clients,
      prediction: mlResponse.data.prediction,
      risk_score: mlResponse.data.risk_score,
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create application" });
  }
});

// Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

module.exports = router;
