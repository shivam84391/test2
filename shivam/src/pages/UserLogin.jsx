import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../assets/logos.png"

const UserLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // 🔹 Basic frontend validation
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          email,
          password,
        },
        { withCredentials: true } // 🔐 cookie-based auth
      );

      toast.success(res.data.message || "Login successful");
      if (res.data.user) {
  localStorage.setItem("user", JSON.stringify(res.data.user));
}

      setTimeout(() => {
        if (res.data.user?.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/feedback");
        }
      }, 1200);

    } catch (err) {
      const data = err.response?.data;

      if (data?.message) {
        toast.error(data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
        <div className="form-container">

  {/* LOGO */}
  <div className="logo-wrap">
    <img src={logo} alt="Company Logo" />
  </div>


        <p className="title">Welcome Back</p>
        <p className="subtitle">Login with Email</p>

        <form className="form" onSubmit={submitHandler}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="forgot">
              <a href="#">Forgot password?</a>
            </div>
          </div>

          <button type="submit" className="sign" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup">
          Don’t have an account?
          <Link to="/register"> Sign up</Link>
        </p>
      </div>
    </Wrapper>
  );
};

export default UserLogin;


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0f172a;

  .form-container {
    width: 340px;
    border-radius: 12px;
    background-color: #111827;
    padding: 2rem;
    color: #f3f4f6;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  .title {
    text-align: center;
    font-size: 1.6rem;
    font-weight: 700;
  }

  .subtitle {
    text-align: center;
    font-size: 0.85rem;
    color: #9ca3af;
    margin-top: 4px;
  }

  .form {
    margin-top: 1.8rem;
  }

  .input-group {
    margin-bottom: 1.2rem;
  }

  .input-group label {
    display: block;
    font-size: 0.8rem;
    color: #9ca3af;
    margin-bottom: 6px;
  }

  .input-group input {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #374151;
    background-color: #111827;
    padding: 0.75rem 1rem;
    color: #f3f4f6;
    font-size: 0.9rem;
  }

  .input-group input:focus {
    outline: none;
    border-color: #a78bfa;
  }

  .forgot {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
    font-size: 0.75rem;
  }

  .forgot a {
    color: #a78bfa;
    text-decoration: none;
  }

  .forgot a:hover {
    text-decoration: underline;
  }

  .sign {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    background-color: #a78bfa;
    color: #111827;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: 0.3s;
  }

  .sign:hover {
    background-color: #8b5cf6;
  }

  .signup {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.75rem;
    color: #9ca3af;
  }
    .logo-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1.2rem;
}

.logo-wrap img {
  width: 200px;          /* professional size */
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(0 6px 18px rgba(167,139,250,0.45));
}


  .signup a {
    color: #a78bfa;
    text-decoration: none;
    margin-left: 4px;
  }

  .signup a:hover {
    text-decoration: underline;
  }
`;

