import { useState } from "react";

const API_BASE = "http://localhost:4000/api/game";

export default function JoinScreen({ onRegistered }) {
  const [initials, setInitials] = useState("");
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initials })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to register");
      } else {
        onRegistered(data.player);
      }
    } catch (err) {
      console.error(err);
      setError("Request failed");
    }
  };

  return (
    <div className="join-screen">
      <h2>Join the Table</h2>
      <form onSubmit={handleJoin} className="join-form">
        <input
          type="text"
          placeholder="Your initials (e.g. AS)"
          value={initials}
          onChange={(e) => setInitials(e.target.value)}
        />
        <button type="submit">Join Game</button>
      </form>
      {error && <div className="error-text">{error}</div>}
      <p className="hint">
        Initials must be unique.
      </p>
    </div>
  );
}
