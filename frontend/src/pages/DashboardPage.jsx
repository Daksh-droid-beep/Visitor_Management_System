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

  // ✅ UPDATE STATUS (NEW)
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/visitors/update-status?visitorId=${id}&status=${status}`,
        {
          method: "PUT",
          headers: { Authorization: token }
        }
      );

      const msg = await res.text();
      alert(msg);
      fetchVisitors();
    } catch {
      alert("Only Admin allowed ❌");
    }
  };

  // ✅ GENERATE PASS (IMPROVED)
  const generatePass = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/passes/generate?visitorId=${id}`,
        { headers: { Authorization: token } }
      );

      const data = await res.json();

      if (!data.pass) {
        alert(data.message || "Cannot generate pass ❌");
        return;
      }

      setQrImage(data.pass.qrCode);
      alert(data.message);

      fetchVisitors();
    } catch {
      alert("Server error ❌");
    }
  };

  const checkIn = async (passId) => {
    if (!passId) return alert("No pass available ❌");

    try {
      const res = await fetch(
        `http://localhost:5000/api/check/checkin?passId=${passId}`,
        { headers: { Authorization: token } }
      );

      const msg = await res.text();
      alert(msg);
      fetchVisitors();
    } catch {
      alert("Only Security allowed ❌");
    }
  };

  const checkOut = async (passId) => {
    if (!passId) return alert("No pass available ❌");

    try {
      const res = await fetch(
        `http://localhost:5000/api/check/checkout?passId=${passId}`,
        { headers: { Authorization: token } }
      );

      const msg = await res.text();
      alert(msg);
      fetchVisitors();
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
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
              }}
            >
              <h3>{v.name}</h3>

              <p>📧 {v.email}</p>
              <p>📱 {v.phone || "N/A"}</p>
              <p>🎯 {v.purpose}</p>

              {/* STATUS */}
              <span style={{ ...getStatusStyle(v.status), padding: "5px 12px", borderRadius: "20px" }}>
                {v.status}
              </span>

              {/* PASS */}
              {v.passId && (
                <p style={{ marginTop: "8px" }}>
                  Pass: {v.passStatus}
                </p>
              )}

              <div style={{ marginTop: "15px" }}>

                {/* ADMIN */}
                {role === "admin" && (
                  <>
                    {/* APPROVE / REJECT */}
                    <button onClick={() => updateStatus(v._id, "approved")} style={{ margin: "5px", background: "#00c853", color: "white" }}>
                      Approve
                    </button>

                    <button onClick={() => updateStatus(v._id, "rejected")} style={{ margin: "5px", background: "#d50000", color: "white" }}>
                      Reject
                    </button>

                    {/* GENERATE PASS */}
                    <button
                      onClick={() => generatePass(v._id)}
                      disabled={v.status !== "approved"}
                      style={{
                        background: v.status !== "approved" ? "#777" : "#00c853",
                        color: "white",
                        padding: "8px 15px",
                        border: "none",
                        borderRadius: "8px",
                        marginTop: "10px",
                        cursor: "pointer"
                      }}
                    >
                      Generate Pass 🚀
                    </button>
                  </>
                )}

                {/* SECURITY */}
                {role === "security" && (
                  <>
                    <button
                      onClick={() => checkIn(v.passId)}
                      disabled={!v.passId || v.passStatus === "checked-in"}
                    >
                      Check-In
                    </button>

                    <button
                      onClick={() => checkOut(v.passId)}
                      disabled={!v.passId || v.passStatus !== "checked-in"}
                    >
                      Check-Out
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No visitors found 😕</p>
        )}
      </div>

      {/* QR */}
      {qrImage && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <h3>QR Code</h3>
          <img src={qrImage} alt="QR" width="200" />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;