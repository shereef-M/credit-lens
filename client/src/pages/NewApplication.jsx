import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createApplication } from "../api/client";

const initialState = {
  applicantName: "",
  loanamount: "",
  totaldue: "",
  termdays: "",
  loannumber: "",
  prev_loan_count: "",
  avg_days_early_late: "",
  max_days_late: "",
  avg_loanamount: "",
  was_referred: "0",
  has_demographics: "1",
  longitude_gps: "",
  latitude_gps: "",
  bank_account_type: "Savings",
  bank_name_clients: "",
  employment_status_clients: "Permanent",
};

const fields = [
  { name: "applicantName", label: "Applicant Name", type: "text" },
  {
    name: "loanamount",
    label: "Loan Amount (₦)",
    type: "number",
    helper: "The principal amount requested.",
  },
  {
    name: "totaldue",
    label: "Total Due (₦)",
    type: "number",
    helper: "Total repayable amount, including interest.",
  },
  {
    name: "termdays",
    label: "Loan Term (days)",
    type: "number",
    helper: "Typical short-term digital loans run 15–90 days.",
  },
  {
    name: "loannumber",
    label: "Loan Number",
    type: "number",
    helper:
      "This applicant's Nth loan overall (e.g. 1 for a first-time borrower).",
  },
  {
    name: "prev_loan_count",
    label: "Previous Loan Count",
    type: "number",
    helper: "How many loans this applicant has completed before this one.",
  },
  {
    name: "avg_days_early_late",
    label: "Avg. Days Early/Late",
    type: "number",
    helper:
      "Average repayment timing on past loans. Negative = paid early, positive = paid late.",
  },
  {
    name: "max_days_late",
    label: "Worst Days Late",
    type: "number",
    helper: "The latest a repayment has ever been, in days.",
  },
  {
    name: "avg_loanamount",
    label: "Avg. Previous Loan Amount (₦)",
    type: "number",
    helper: "Average size of this applicant's past loans.",
  },
  { name: "longitude_gps", label: "Longitude", type: "number" },
  { name: "latitude_gps", label: "Latitude", type: "number" },
  { name: "bank_name_clients", label: "Bank Name", type: "text" },
];

export default function NewApplication() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        loanamount: Number(form.loanamount),
        totaldue: Number(form.totaldue),
        termdays: Number(form.termdays),
        loannumber: Number(form.loannumber),
        prev_loan_count: Number(form.prev_loan_count) || 0,
        avg_days_early_late: Number(form.avg_days_early_late) || 0,
        max_days_late: Number(form.max_days_late) || 0,
        avg_loanamount: Number(form.avg_loanamount) || 0,
        was_referred: Number(form.was_referred),
        has_demographics: Number(form.has_demographics),
        longitude_gps: Number(form.longitude_gps),
        latitude_gps: Number(form.latitude_gps),
      };
      const res = await createApplication(payload);
      navigate(`/applications/${res.data._id}`);
    } catch (err) {
      setError("Failed to submit application. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <p>
        <Link to="/">&larr; Back to Dashboard</Link>
      </p>
      <h2>New Loan Application</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div className="form-group" key={f.name}>
              <label htmlFor={f.name}>{f.label}</label>
              {f.helper && <span className="helper-text">{f.helper}</span>}
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="bank_account_type">Bank Account Type</label>
            <select
              id="bank_account_type"
              name="bank_account_type"
              value={form.bank_account_type}
              onChange={handleChange}
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="employment_status_clients">Employment Status</label>
            <select
              id="employment_status_clients"
              name="employment_status_clients"
              value={form.employment_status_clients}
              onChange={handleChange}
            >
              <option value="Permanent">Permanent</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="was_referred">Referral Status</label>
            <span className="helper-text">
              Was this applicant referred by an existing customer?
            </span>
            <select
              id="was_referred"
              name="was_referred"
              value={form.was_referred}
              onChange={handleChange}
            >
              <option value="0">Not Referred</option>
              <option value="1">Referred</option>
            </select>
          </div>

          {error && <p style={{ color: "var(--color-bad)" }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
