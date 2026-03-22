import { useEffect, useState } from "react";

function DashboardPage() {
  const [visitors, setVisitors] = useState([]);
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/visitors");
      const data = await res.json();
      setVisitors(data);
    } catch (error) {
      console.log(error);
    }
  };

  const generatePass = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/passes/generate?visitorId=${id}`
      );
      const data = await res.json();

      setQrImage(data.pass.qrCode);

      alert("Pass Generated ✅");
    } catch (error) {
      alert("Error generating pass ❌");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Dashboard</h2>

      {visitors.map((v) => (
        <div
          key={v._id}
          style={{
            border: "1px solid #444",
            borderRadius: "10px",
            margin: "15px auto",
            padding: "15px",
            width: "400px",
            background: "#1e1e2f",
            color: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)"
          }}
        >
          <p><b>Name:</b> {v.name}</p>
          <p><b>Purpose:</b> {v.purpose}</p>
          <p><b>Host:</b> {v.host}</p>

          <button
            style={{
              background: "#4CAF50",
              color: "white",
              padding: "8px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px"
            }}
            onClick={() => generatePass(v._id)}
          >
            Generate Pass 🚀
          </button>
        </div>
      ))}

      {/* QR DISPLAY */}
      {qrImage && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>QR Code</h3>
          <img src={qrImage} alt="QR Code" width="200" />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;