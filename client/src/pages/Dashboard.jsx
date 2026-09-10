import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApplications } from "../api/client";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getApplications()
      .then((res) => setApplications(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load applications.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>Applications</h2>
        <Link
          to="/new"
          className="btn-primary"
          style={{
            display: "inline-block",
            width: "auto",
            textDecoration: "none",
          }}
        >
          + New Application
        </Link>
      </div>

      {!loading && !error && applications.length > 0 && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div
            className="card"
            style={{ flex: 1, padding: 16, textAlign: "center" }}
          >
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {applications.length}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              Total Applications
            </div>
          </div>
          <div
            className="card"
            style={{ flex: 1, padding: 16, textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--color-bad)",
              }}
            >
              {applications.filter((a) => a.prediction === "Bad").length}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              Flagged High-Risk
            </div>
          </div>
          <div
            className="card"
            style={{ flex: 1, padding: 16, textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--color-good)",
              }}
            >
              {applications.filter((a) => a.prediction === "Good").length}
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              Low Risk
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <p style={{ padding: 24 }}>Loading...</p>
        ) : error ? (
          <p style={{ padding: 24, color: "var(--color-bad)" }}>{error}</p>
        ) : applications.length === 0 ? (
          <p style={{ padding: 24 }}>No applications yet.</p>
        ) : (
          <table
            width="100%"
            cellPadding="12"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "2px solid var(--color-primary)",
                  background: "#fafafa",
                }}
              >
                <th>Applicant</th>
                <th>Loan Amount</th>
                <th>Prediction</th>
                <th>Risk Score</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <td>{app.applicantName}</td>
                  <td>₦{app.loanamount?.toLocaleString()}</td>
                  <td>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        background:
                          app.prediction === "Bad"
                            ? "var(--color-bad-bg)"
                            : "var(--color-good-bg)",
                        color:
                          app.prediction === "Bad"
                            ? "var(--color-bad)"
                            : "var(--color-good)",
                      }}
                    >
                      {app.prediction}
                    </span>
                  </td>
                  <td>{app.risk_score}</td>
                  <td>
                    <Link to={`/applications/${app._id}`}>View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
