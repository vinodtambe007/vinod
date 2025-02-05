import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const register_success = (success) =>
    toast.success("Success:" + success, {
      duration: 5000,
      style: {
        backgroundColor: "#4BB543",
        color: "#fff",
      },
      position: "top-right",
    });
  const register_error = (error) =>
    toast.error("Error: " + error, {
      duration: 5000,
      style: {
        backgroundColor: "#FF6F61",
        color: "#fff",
      },
      position: "bottom-right",
    });

  const roles = ["Admin", "User"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("at start");
    if (userData.password !== userData.confirm_password) {
      register_error("Passwords do not match!");
      return;
    }
    fetch(`${process.env.REACT_APP_API}/user/register-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
        return data;
      })
      .then((data) => {
        console.log("User created successfully:", data);
        const { token } = data;
        sessionStorage.setItem("authToken", token);
        setIsRegistered(false);
      })
      .catch((error) => {
        console.error("Error:", error.message);

        if (error.message === "User already exists!") {
          setIsRegistered(true);
        } else {
          setError(error.message);
        }
      })
      .finally(() => {
        setSubmitted(false);
      });
  };

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Registration Form
        </h2>

        {isRegistered ? (
          <div className="text-center text-red-500 font-semibold">
            <h3 className="text-lg mb-2">Already registered!</h3>
            <button
              onClick={handleGoToLogin}
              className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Go to Login
            </button>
          </div>
        ) : submitted ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Thank you for registering!
            </h3>
            <p className="mb-1">Name: {userData.name}</p>
            <p className="mb-1">Email: {userData.email}</p>
            <p className="mb-1">Role: {userData.role}</p>
            <button
              onClick={handleGoToLogin}
              className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter mail-id"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Set password"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password:
              </label>
              <input
                type="password"
                name="confirm_password"
                value={userData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Role:
              </label>
              <select
                name="role"
                value={userData.role}
                onChange={handleChange}
                title="Select your role"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="">Select your role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Register
            </button>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
