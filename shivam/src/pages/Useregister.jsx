import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../assets/logos.png"

const UserRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { fullName, mobile, email, password } = formData;

    // 🔹 Frontend basic validation
    if (!fullName || !mobile || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        formData
      );

      // 🔹 Success toast
      toast.success(
        res.data.message ||
          "Registration successful. Await admin verification."
      );

      // 🔹 Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      const data = err.response?.data;

      // 🔹 Field-wise backend validation errors
      if (data?.errors && typeof data.errors === "object") {
        Object.values(data.errors).forEach((msg) => {
          toast.error(msg);
        });
      }

      // 🔹 Single backend message
      else if (data?.message) {
        toast.error(data.message);
      }

      // 🔹 Fallback error
      else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="form-container">
         <div className="logo-wrap">
            <img src={logo} alt="Company Logo" />
          </div>
        
        <p className="title">Create Account</p>
        <p className="subtitle">Register with your details</p>

        <form className="form" onSubmit={submitHandler}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

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
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="sign" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="signup">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </Wrapper>
  );
};

export default UserRegister;




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

  .signup a {
    color: #a78bfa;
    text-decoration: none;
    margin-left: 4px;
  }

  .signup a:hover {
    text-decoration: underline;
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
`;
const ErrorText = styled.p`
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  padding: 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  margin-bottom: 10px;
  text-align: center;
`;

