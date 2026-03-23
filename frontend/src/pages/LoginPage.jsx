import { useState } from "react";

function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/login?email=${email}&password=${password}`
      );
      const data = await res.json();

      if (!data.token) {
        alert("Invalid credentials ❌");
        return;
      }

      setUser({
        token: data.token,
        role: data.role
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      alert("Login Successful ✅");
    } catch (error) {
      alert("Login Failed ❌");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f1658, #841337)",
        fontFamily: "Arial"
      }}
    >
      {/* LOGIN CARD */}
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "15px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(15px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          textAlign: "center",
          color: "white"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Welcome Back 👋</h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="📧 Enter Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "none",
            outline: "none"
          }}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="🔒 Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "none",
            outline: "none"
          }}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(45deg, #00c6ff, #0072ff)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s"
          }}
        >
          Login 🚀
        </button>

        {/* EXTRA TEXT */}
        <p style={{ marginTop: "15px", fontSize: "12px", opacity: 0.7 }}>
          Secure Visitor Management System
        </p>
      </div>
    </div>
  );
}

export default LoginPage;