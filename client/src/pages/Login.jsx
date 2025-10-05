import React, { useState } from 'react'
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { axios, setToken } = useAppContext()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = state === "login" ? "/api/user/login" : "/api/user/register";

    try {

      const { data } = await axios.post(url, { name, email, password });
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
    // if (state === "login") {
    //   console.log("Logging in with", { email, password });
    // } else if (state === "signup") {
    //   console.log("Signing up with", { name, email, password });
    // } else if (state === "forgotPassword") {
    //   console.log("Password reset link sent to", { email });
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-black border border-white">
      {/* Outer container with gradient border */}
      <div className="flex h-[700px] w-full max-w-5xl rounded-2xl p-[2px] border border-white">
        {/* Inner container - DARK background */}
        <div className="flex w-full rounded-2xl bg-[#0e0e18] overflow-hidden ">

          {/* Left side image */}
          <div className="w-1/2 hidden md:block">
            <img
              className="h-full w-full object-cover"
              src={assets.gptImage1}
              alt="leftSideImage"
            />
          </div>

          {/* Right side form */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
            <form onSubmit={handleSubmit} className="md:w-80 w-72 flex flex-col items-center justify-center">
              <h2 className="text-3xl text-white font-semibold">
                {state === "login" && "Sign In"}
                {state === "signup" && "Sign Up"}
                {state === "forgotPassword" && "Reset Password"}
              </h2>
              <p className="text-sm text-gray-400 mt-3">
                {state === "login" && "Login to your account"}
                {state === "signup" && "Create a new account to get started"}
                {state === "forgotPassword" && "Enter your email to reset password"}
              </p>

              {/* Google login */}
              {(state === "login" || state === "signup") && (
                <button
                  type="button"
                  className="w-full mt-8 bg-[#1a1a2e] flex items-center justify-center h-12 rounded-full hover:bg-[#23233a] transition-all"
                >
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                    alt="googleLogo"
                  />
                </button>
              )}

              {(state === "login" || state === "signup") && (
                <div className="flex items-center gap-4 w-full my-5">
                  <div className="w-full h-px bg-gray-700"></div>
                  <p className="w-full text-nowrap text-sm text-gray-400">or sign in with email</p>
                  <div className="w-full h-px bg-gray-700"></div>
                </div>
              )}

              {/* Name field for signup */}
              {state === "signup" && (
                <div className="flex items-center w-full bg-transparent border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-gray-300 placeholder-gray-500 outline-none text-sm w-full h-full"
                    required
                  />
                </div>
              )}

              {/* Email field */}
              <div className="flex items-center mt-6 w-full bg-transparent border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                    fill="#9ca3af"
                  />
                </svg>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-gray-300 placeholder-gray-500 outline-none text-sm w-full h-full"
                  required
                />
              </div>

              {/* Password field */}
              {(state === "login" || state === "signup") && (
                <div className="flex items-center mt-6 w-full bg-transparent border border-gray-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
                  <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                      fill="#9ca3af"
                    />
                  </svg>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent text-gray-300 placeholder-gray-500 outline-none text-sm w-full h-full"
                    required
                  />
                </div>
              )}

              {/* Remember me + forgot password */}
              {state === "login" && (
                <div className="w-full flex items-center justify-between mt-8 text-gray-400">
                  <div className="flex items-center gap-2">
                    <input className="h-5" type="checkbox" id="checkbox" />
                    <label className="text-sm" htmlFor="checkbox">Remember me</label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setState("forgotPassword")}
                    className="text-sm hover:underline text-indigo-400 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-8 w-full h-11 rounded-full text-white
                 bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md
                  shadow-indigo-900 cursor-pointer"
              >
                {state === "login" && "Sign in"}
                {state === "signup" && "Sign up"}
                {state === "forgotPassword" && "Send reset link"}
              </button>

              {/* Toggle between login & signup */}
              {state !== "forgotPassword" && (
                <p className="text-gray-400 text-sm mt-4">
                  {state === "login" ? (
                    <>
                      Don’t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setState("signup")}
                        className="text-indigo-400 hover:underline cursor-pointer"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setState("login")}
                        className="text-indigo-400 hover:underline cursor-pointer"
                      >
                        Login
                      </button>
                    </>
                  )}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
