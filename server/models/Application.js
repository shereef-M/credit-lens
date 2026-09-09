const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicantName: { type: String, required: true },
    loanamount: { type: Number, required: true },
    totaldue: { type: Number, required: true },
    termdays: { type: Number, required: true },
    prev_loan_count: { type: Number, default: 0 },
    avg_days_early_late: { type: Number, default: 0 },
    max_days_late: { type: Number, default: 0 },
    avg_loanamount: { type: Number, default: 0 },
    was_referred: { type: Number, default: 0 },
    has_demographics: { type: Number, default: 1 },
    longitude_gps: { type: Number, required: true },
    latitude_gps: { type: Number, required: true },
    bank_account_type: { type: String, required: true },
    bank_name_clients: { type: String, required: true },
    employment_status_clients: { type: String, required: true },
    prediction: { type: String },
    risk_score: { type: Number },
    loannumber: { type: Number, required: true },
    top_factors: [{ feature: String, effect: String }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
