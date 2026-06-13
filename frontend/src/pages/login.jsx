import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.css";



export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
     navigate("/dashboard");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!identifier || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifier,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      alert("Login successful");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <p className="title">Login</p>

      <form className="container-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="submit"
          value={loading ? "Logging in..." : "Login"}
          disabled={loading}
        />
      </form>

      {/* ✔ MOVE LINK OUTSIDE THE FORM */}
      <p className="switch-link">
        Don’t have an account?{" "}
        <a href="/sign-in">Create one</a>
      </p>
    </div>
  );
}
