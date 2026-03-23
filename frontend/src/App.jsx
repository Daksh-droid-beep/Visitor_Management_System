import { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Visitor Pass System 🚀</h1>

      {!user ? (
        <LoginPage setUser={setUser} />
      ) : (
        <DashboardPage />
      )}
    </div>
  );
}

export default App;