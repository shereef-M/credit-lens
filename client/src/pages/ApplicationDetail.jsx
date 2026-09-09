import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

export default function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/api/applications/${id}`)
      .then((res) => setApplication(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load application.");
      });
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!application) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <Link to="/">&larr; Back to Dashboard</Link>
      <h2>{application.applicantName}</h2>

      <div
        style={{
          padding: 16,
          borderRadius: 8,
          background: application.prediction === "Bad" ? "#fdecea" : "#eafaf1",
          marginBottom: 20,
        }}
      >
        <strong>Prediction: {application.prediction}</strong>
        <p>Risk score: {application.risk_score}</p>

        {application.top_factors && (
          <div style={{ marginTop: 10 }}>
            <strong>Key factors:</strong>
            <ul>
              {application.top_factors.map((factor, i) => (
                <li key={i}>
                  {factor.feature.replace(/_/g, " ")} ({factor.effect} risk)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <h4>Loan Details</h4>
      <ul>
        <li>Loan Amount: {application.loanamount}</li>
        <li>Total Due: {application.totaldue}</li>
        <li>Term: {application.termdays} days</li>
        <li>Previous Loan Count: {application.prev_loan_count}</li>
        <li>Avg Days Early/Late: {application.avg_days_early_late}</li>
        <li>
          Bank: {application.bank_name_clients} ({application.bank_account_type}
          )
        </li>
        <li>Employment: {application.employment_status_clients}</li>
      </ul>
    </div>
  );
}
