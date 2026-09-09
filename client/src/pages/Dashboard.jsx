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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Applications</h2>
        <Link to="/new">+ New Application</Link>
      </div>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table
          width="100%"
          cellPadding="8"
          style={{ borderCollapse: "collapse", marginTop: 20 }}
        >
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              <th>Applicant</th>
              <th>Loan Amount</th>
              <th>Prediction</th>
              <th>Risk Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{app.applicantName}</td>
                <td>{app.loanamount}</td>
                <td
                  style={{
                    color: app.prediction === "Bad" ? "crimson" : "green",
                  }}
                >
                  {app.prediction}
                </td>
                <td>{app.risk_score}</td>
                <td>
                  <Link to={`/applications/${app._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
