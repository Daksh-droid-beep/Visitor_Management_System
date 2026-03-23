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

      // ✅ Save user in state
      setUser({
        token: data.token,
        role: data.role
      });

      // ✅ Save in localStorage (important)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      alert("Login Successful ✅");

    } catch (error) {
      alert("Login Failed ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login 🚀</button>
    </div>
  );
}

export default LoginPage;