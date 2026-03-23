import { useEffect, useState } from "react";

function DashboardPage() {
  const [visitors, setVisitors] = useState([]);
  const [qrImage, setQrImage] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/visitors", {
        headers: { Authorization: token }
      });

      const data = await res.json();
      setVisitors(data);
    } catch (error) {
      console.log(error);
    }
  };

  const generatePass = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/passes/generate?visitorId=${id}`,
        {
          headers: { Authorization: token }
        }
      );

      const data = await res.json();
      setQrImage(data.pass.qrCode);

      alert("Pass Generated ✅");
    } catch {
      alert("Only Admin can generate pass ❌");
    }
  };

  const checkIn = async (passId) => {
    if (!passId) return alert("No pass available ❌");

    try {
      await fetch(
        `http://localhost:5000/api/check/checkin?passId=${passId}`,
        {
          headers: { Authorization: token }
        }
      );
      alert("Checked In ✅");
    } catch {
      alert("Only Security allowed ❌");
    }
  };

  const checkOut = async (passId) => {
    if (!passId) return alert("No pass available ❌");

    try {
      await fetch(
        `http://localhost:5000/api/check/checkout?passId=${passId}`,
        {
          headers: { Authorization: token }
        }
      );
      alert("Checked Out ❌");
    } catch {
      alert("Only Security allowed ❌");
    }
  };

  // ✅ FILTER + SEARCH (IMPROVED)
  const filteredVisitors = visitors
    .filter((v) => (filter === "all" ? true : v.status === filter))
    .filter((v) => {
      const searchText = search.toLowerCase();

      return (
        (v.name || "").toLowerCase().includes(searchText) ||
        (v.email || "").toLowerCase().includes(searchText) ||
        (v.phone || "").includes(searchText) ||
        (v.purpose || "").toLowerCase().includes(searchText)
      );
    });

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Dashboard</h2>

      <h3 style={{ marginBottom: "20px" }}>Role: {role}</h3>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by name, email, phone, purpose..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "320px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          outline: "none"
        }}
      />

      {/* 🔥 FILTER BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        {["all", "approved", "pending", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              margin: "5px",
              padding: "8px 15px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: filter === f ? "#4CAF50" : "#444",
              color: "white"
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* VISITORS */}
      {filteredVisitors.length > 0 ? (
        filteredVisitors.map((v) => (
          <div
            key={v._id}
            style={{
              border: "1px solid #444",
              borderRadius: "10px",
              margin: "15px auto",
              padding: "20px",
              width: "400px",
              background: "#1e1e2f",
              color: "white",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)"
            }}
          >
            <h3>{v.name}</h3>

            <p>📧 {v.email}</p>
            <p>📱 {v.phone || "N/A"}</p>
            <p>🎯 {v.purpose}</p>

            {/* STATUS */}
            <p
              style={{
                color:
                  v.status === "approved"
                    ? "lightgreen"
                    : v.status === "pending"
                    ? "orange"
                    : "red",
                fontWeight: "bold"
              }}
            >
              {v.status}
            </p>

            {/* ADMIN */}
            {role === "admin" && (
              <button
                onClick={() => generatePass(v._id)}
                style={{
                  background: "#4CAF50",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Generate Pass 🚀
              </button>
            )}

            {/* SECURITY */}
            {role === "security" && (
              <>
                <button
                  onClick={() => checkIn(v.passId)}
                  style={{
                    background: "#2196F3",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "5px",
                    margin: "5px",
                    cursor: "pointer"
                  }}
                >
                  Check-In ✅
                </button>

                <button
                  onClick={() => checkOut(v.passId)}
                  style={{
                    background: "#f44336",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "5px",
                    margin: "5px",
                    cursor: "pointer"
                  }}
                >
                  Check-Out ❌
                </button>
              </>
            )}
          </div>
        ))
      ) : (
        <p style={{ color: "gray", marginTop: "20px" }}>
          No visitors found 😕
        </p>
      )}

      {/* QR */}
      {qrImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>QR Code</h3>
          <img src={qrImage} alt="QR Code" width="200" />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;