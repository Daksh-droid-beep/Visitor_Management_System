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
        { headers: { Authorization: token } }
      );

      const data = await res.json();
      setQrImage(data.pass.qrCode);
      alert("Pass Generated ✅");

      fetchVisitors(); // 🔥 refresh after generating pass
    } catch {
      alert("Only Admin can generate pass ❌");
    }
  };

  const checkIn = async (passId) => {
    if (!passId) return alert("No pass available ❌");

    try {
      await fetch(
        `http://localhost:5000/api/check/checkin?passId=${passId}`,
        { headers: { Authorization: token } }
      );

      alert("Checked In ✅");
      fetchVisitors(); // 🔥 refresh UI
    } catch {
      alert("Only Security allowed ❌");
    }
  };

  const checkOut = async (passId) => {
    if (!passId) return alert("No pass available ❌");

    try {
      await fetch(
        `http://localhost:5000/api/check/checkout?passId=${passId}`,
        { headers: { Authorization: token } }
      );

      alert("Checked Out ✅");
      fetchVisitors(); // 🔥 refresh UI
    } catch {
      alert("Only Security allowed ❌");
    }
  };

  const filteredVisitors = visitors
    .filter((v) => (filter === "all" ? true : v.status === filter))
    .filter((v) => {
      const s = search.toLowerCase();
      return (
        (v.name || "").toLowerCase().includes(s) ||
        (v.email || "").toLowerCase().includes(s) ||
        (v.phone || "").includes(s) ||
        (v.purpose || "").toLowerCase().includes(s)
      );
    });

  const getStatusStyle = (status) => {
    if (status === "approved")
      return { background: "#1b5e20", color: "#00e676" };
    if (status === "pending")
      return { background: "#ff9800", color: "#fff" };
    return { background: "#b71c1c", color: "#fff" };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
        fontFamily: "Arial"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        Visitor Dashboard
      </h1>

      <h3 style={{ textAlign: "center", opacity: 0.8 }}>
        Role: {role}
      </h3>

      {/* SEARCH */}
      <div style={{ textAlign: "center", margin: "25px 0" }}>
        <input
          type="text"
          placeholder="🔍 Search visitors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            width: "320px",
            borderRadius: "25px",
            border: "none",
            outline: "none",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)"
          }}
        />
      </div>

      {/* FILTER */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {["all", "approved", "pending", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              margin: "6px",
              padding: "10px 18px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background: filter === f ? "#8400ffcc" : "#444",
              color: "white",
              transition: "0.3s"
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* VISITOR GRID */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px"
        }}
      >
        {filteredVisitors.length > 0 ? (
          filteredVisitors.map((v) => (
            <div
              key={v._id}
              style={{
                width: "300px",
                padding: "20px",
                borderRadius: "15px",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                transition: "0.3s"
              }}
            >
              <h3>{v.name}</h3>

              <p>📧 {v.email}</p>
              <p>📱 {v.phone || "N/A"}</p>
              <p>🎯 {v.purpose}</p>

              {/* STATUS BADGE */}
              <span
                style={{
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  ...getStatusStyle(v.status)
                }}
              >
                {v.status}
              </span>

              {/* PASS STATUS */}
              {v.passId && (
                <p style={{ marginTop: "8px", fontSize: "13px", opacity: 0.8 }}>
                  Pass: {v.passStatus}
                </p>
              )}

              <div style={{ marginTop: "15px" }}>
                {/* ADMIN */}
                {role === "admin" && (
                  <button
                    onClick={() => generatePass(v._id)}
                    style={{
                      background: "linear-gradient(45deg,#00c853,#64dd17)",
                      color: "white",
                      padding: "8px 15px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginTop: "10px"
                    }}
                  >
                    Generate Pass 🚀
                  </button>
                )}

                {/* SECURITY */}
                {role === "security" && (
                  <>
                    {/* CHECK-IN */}
                    <button
                      onClick={() => checkIn(v.passId)}
                      disabled={!v.passId || v.passStatus === "checked-in"}
                      style={{
                        background:
                          v.passStatus === "checked-in" ? "#777" : "#2196F3",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "6px",
                        margin: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Check-In
                    </button>

                    {/* CHECK-OUT */}
                    <button
                      onClick={() => checkOut(v.passId)}
                      disabled={!v.passId || v.passStatus !== "checked-in"}
                      style={{
                        background:
                          v.passStatus !== "checked-in" ? "#777" : "#f44336",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "6px",
                        margin: "5px",
                        cursor: "pointer"
                      }}
                    >
                      Check-Out
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ marginTop: "20px", opacity: 0.7 }}>
            No visitors found 😕
          </p>
        )}
      </div>

      {/* QR */}
      {qrImage && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <h3>QR Code</h3>
          <img
            src={qrImage}
            alt="QR"
            style={{
              borderRadius: "10px",
              boxShadow: "0 0 15px rgba(0,0,0,0.5)"
            }}
            width="200"
          />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;