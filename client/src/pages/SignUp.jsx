import { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { NavLink } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create userData object
    const userData = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    // Simple validation
    if (!userData.email || !userData.username || !userData.password) {
      // console.log(
      //   "Email:",
      //   userData.email,
      //   "Username: ",
      //   userData.username,
      //   "Password: ",
      //   userData.password
      // );
      setMessage("All fields are required. Please fill in the form.");
      return;
    }

    // Clear error message if form is valid
    setMessage("");

    e.target.reset();

    console.log("User Data:", userData);
    // Proceed with submitting userData (e.g., API call)

    async function sendUserData(userData) {
      try {
        const response = await axios.post(
          "http://localhost:3500/users/create-user",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          console.log("User data sent successfully:", response.data);
        } else {
          console.error("Failed to send user data. Status:", response);
        }
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error occurred while signing up user:", error);
        setMessage(error.message);
      }
    }

    sendUserData(userData);
  };

  return (
    <div className="flex justify-center">
      <form className="card-body max-w-[50%]" onSubmit={handleSubmit}>
        <div className="mb-5">
          <h1 className="text-3xl text-center">
            Welcome to <span className="font-semibold">Stack Overflow</span>
          </h1>
          <h3 className="text-slate-500 text-center mt-2">
            Please sign up to contribute.
          </h3>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="email"
            className="input input-bordered"
            ref={emailRef}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="username"
            placeholder="username"
            className="input input-bordered"
            ref={usernameRef}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered"
            ref={passwordRef}
            required
          />
        </div>
        {message && <p className="text-red-500 text-center py-3">{message}</p>}
        <div className="form-control mt-6">
          <button className="btn btn-primary bg-[#eaba93] hover:bg-[#d8843f] border-none text-white text-base font-semibold">
            Sign Up
          </button>
        </div>
        <div className="form-control mt-2">
          <button className="btn btn-primary bg-gray-300 hover:bg-[#d8843f] border-none">
            <FcGoogle className="text-xl" />
            <span className="text-black font-bold">Sign In With Google</span>
          </button>
        </div>

        <div className="text-center mt-5">
          Already have an account?{" "}
          <span className="underline text-[#0D7EBF] font-bold text-lg">
            <NavLink to="/sign-in">Sign In</NavLink>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
