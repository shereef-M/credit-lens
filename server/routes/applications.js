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
      loannumber,
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
      loannumber,
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
      loannumber,
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
      top_factors: mlResponse.data.top_factors,
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
// Get a single application by ID
router.get("/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch application" });
  }
});

module.exports = router;
