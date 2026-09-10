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

  if (error)
    return (
      <div className="page">
        <p style={{ color: "var(--color-bad)" }}>{error}</p>
      </div>
    );
  if (!application)
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );

  const isBad = application.prediction === "Bad";

  const details = [
    ["Loan Amount", `₦${application.loanamount?.toLocaleString()}`],
    ["Total Due", `₦${application.totaldue?.toLocaleString()}`],
    ["Term", `${application.termdays} days`],
    ["Loan Number", application.loannumber],
    ["Previous Loan Count", application.prev_loan_count],
    ["Avg. Days Early/Late", application.avg_days_early_late],
    [
      "Bank",
      `${application.bank_name_clients} (${application.bank_account_type})`,
    ],
    ["Employment", application.employment_status_clients],
  ];

  return (
    <div className="page">
      <p>
        <Link to="/">&larr; Back to Dashboard</Link>
      </p>
      <h2 style={{ marginBottom: 20 }}>{application.applicantName}</h2>

      <div
        className="card"
        style={{
          background: isBad ? "var(--color-bad-bg)" : "var(--color-good-bg)",
          borderColor: isBad ? "#fecaca" : "#bbf7d0",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: application.top_factors ? 16 : 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                marginBottom: 2,
              }}
            >
              Prediction
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: isBad ? "var(--color-bad)" : "var(--color-good)",
              }}
            >
              {application.prediction}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 13,
                color: "var(--color-text-muted)",
                marginBottom: 2,
              }}
            >
              Risk Score
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {application.risk_score}
            </div>
          </div>
        </div>

        {application.top_factors && application.top_factors.length > 0 && (
          <div
            style={{
              borderTop: `1px solid ${isBad ? "#fecaca" : "#bbf7d0"}`,
              paddingTop: 12,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              Key Factors
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {application.top_factors.map((factor, i) => (
                <li key={i} style={{ fontSize: 14, marginBottom: 4 }}>
                  {factor.feature.replace(/_/g, " ")} ({factor.effect} risk)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card">
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 12,
            color: "var(--color-text-muted)",
          }}
        >
          LOAN DETAILS
        </div>
        {details.map(([label, value]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
