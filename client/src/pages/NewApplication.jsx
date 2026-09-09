import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../api/client";

const initialState = {
  applicantName: "",
  loanamount: "",
  totaldue: "",
  termdays: "",
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
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>New Loan Application</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="applicantName"
          placeholder="Applicant Name"
          value={form.applicantName}
          onChange={handleChange}
          required
        />
        <input
          name="loanamount"
          type="number"
          placeholder="Loan Amount"
          value={form.loanamount}
          onChange={handleChange}
          required
        />
        <input
          name="totaldue"
          type="number"
          placeholder="Total Due"
          value={form.totaldue}
          onChange={handleChange}
          required
        />
        <input
          name="termdays"
          type="number"
          placeholder="Term (days)"
          value={form.termdays}
          onChange={handleChange}
          required
        />
        <input
          name="prev_loan_count"
          type="number"
          placeholder="Previous Loan Count"
          value={form.prev_loan_count}
          onChange={handleChange}
        />
        <input
          name="avg_days_early_late"
          type="number"
          placeholder="Avg Days Early/Late"
          value={form.avg_days_early_late}
          onChange={handleChange}
        />
        <input
          name="max_days_late"
          type="number"
          placeholder="Max Days Late"
          value={form.max_days_late}
          onChange={handleChange}
        />
        <input
          name="avg_loanamount"
          type="number"
          placeholder="Avg Previous Loan Amount"
          value={form.avg_loanamount}
          onChange={handleChange}
        />
        <input
          name="longitude_gps"
          type="number"
          placeholder="Longitude"
          value={form.longitude_gps}
          onChange={handleChange}
          required
        />
        <input
          name="latitude_gps"
          type="number"
          placeholder="Latitude"
          value={form.latitude_gps}
          onChange={handleChange}
          required
        />
        <input
          name="bank_name_clients"
          placeholder="Bank Name"
          value={form.bank_name_clients}
          onChange={handleChange}
          required
        />

        <select
          name="bank_account_type"
          value={form.bank_account_type}
          onChange={handleChange}
        >
          <option value="Savings">Savings</option>
          <option value="Current">Current</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="employment_status_clients"
          value={form.employment_status_clients}
          onChange={handleChange}
        >
          <option value="Permanent">Permanent</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Unemployed">Unemployed</option>
          <option value="Unknown">Unknown</option>
        </select>

        <select
          name="was_referred"
          value={form.was_referred}
          onChange={handleChange}
        >
          <option value="0">Not Referred</option>
          <option value="1">Referred</option>
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
