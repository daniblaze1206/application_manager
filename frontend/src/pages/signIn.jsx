import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/signIn.css";

export default function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- AUTO REDIRECT IF LOGGED IN ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  // ---------------- REGISTER HANDLER ----------------
  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password and confirm password do not match");
      return;
    }

    if (!username || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      alert("Registration successful");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  }

  return (
    <div className="form">
      <p className="title">Create account</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <input
          type="submit"
          value={loading ? "Creating account..." : "Register"}
          disabled={loading}
        />

        {/* --- LINK TO LOGIN --- */}
        <p className="switch-link">
          Already have an account?{" "}
          <a href="/login">Log in here</a>
        </p>
      </form>
    </div>
  );
}
