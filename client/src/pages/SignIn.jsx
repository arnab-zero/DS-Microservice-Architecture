import { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [authInfo, setAuthInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await axios.post("http://localhost:3500/users/verify", {
        email: userData.email,
        password: userData.password,
      });
      console.log(response.data);
      setAuthInfo(response);
    } catch (error) {
      console.error("Login failed:", error);
    }

    // const authInfo = await response.json();

    if (authInfo) {
      console.log("User signed in successfully.", authInfo);
      setErrorMessage("");
      console.log(authInfo.data.username);
      navigate("/", { state: { username: authInfo.data.username } });
    } else {
      console.log("Wrong credentials.");
      setErrorMessage("Wrong credentials. Try again.");
    }
  };

  return (
    <div className="flex justify-center">
      <form className="card-body max-w-[50%]" onSubmit={handleSubmit}>
        <div className="mb-5">
          <h1 className="text-3xl text-center">
            Welcome to <span className="font-semibold">Stack Overflow</span>
          </h1>
          <h3 className="text-slate-500 text-center mt-2">
            Please sign in to your account to contribute.
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
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered"
            ref={passwordRef}
            required
          />
          <label className="label">
            <a
              href="#"
              className="text-[#2bb9e8] label-text-alt link link-hover"
            >
              Forgot password?
            </a>
          </label>
        </div>
        {errorMessage && (
          <p className="text-red-500 text-center py-3">{errorMessage}</p>
        )}
        <div className="form-control mt-6">
          <button className="btn btn-primary bg-[#eaba93] hover:bg-[#d8843f] border-none text-white text-base font-semibold">
            Sign In
          </button>
        </div>
        <div className="form-control mt-2">
          <button className="btn btn-primary bg-gray-300 hover:bg-[#d8843f] border-none">
            <FcGoogle className="text-xl" />
            <span className="text-black font-bold">Sign In With Google</span>
          </button>
        </div>

        <div className="text-center mt-5">
          Do not have an account?{" "}
          <span className="underline text-[#0D7EBF] font-bold text-lg">
            <NavLink to="/sign-up">Sign Up</NavLink>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
