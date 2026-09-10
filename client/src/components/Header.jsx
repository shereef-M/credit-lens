import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ background: "var(--color-primary)", padding: "16px 0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 style={{ color: "white", fontSize: 20, margin: 0 }}>CrediLens</h1>
          <p
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}
          >
            Alternative credit risk scoring for Nigerian digital lenders
          </p>
        </Link>
      </div>
    </header>
  );
}
