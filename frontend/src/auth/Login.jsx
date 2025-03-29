import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import { useSetRecoilState } from "recoil";
import { tokenState } from "@/store/auth";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state to trigger redirect
  const [redirectPath, setRedirectPath] = useState(null); // Store redirect path
  const navigate = useNavigate();
  const [timer, setTimer] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  const setTokenState = useSetRecoilState(tokenState);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const allowedDomain = ["@mscb.com", "@cpcb.com"];

  const validateEmailDomain = (email) => {
    if (role === "admin") {
      const isValidDomain = allowedDomain.some((domain) => email.endsWith(domain));
      if (!isValidDomain) {
        toast.error("Invalid authority domain.");
        return false;
      }
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/login`,
        { email, password }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        const token = res.data?.token;
        const user = res.data?.user || {};

        // Set authentication state
        setTokenState(token);
        localStorage.setItem("token", token || "");
        localStorage.setItem("user", JSON.stringify(user));

        // Debugging logs
        console.log("Full API Response:", res.data);
        console.log("Token set:", token);
        console.log("User:", user);
        console.log("userDetailsIncomplete:", res.data.userDetailsIncomplete);

        // Determine redirect path
        const path = res.data.userDetailsIncomplete ? "/adduserdetail" : "/dashboard";
        console.log("Redirecting to:", path);

        // Set state to trigger redirect
        setRedirectPath(path);
        setIsAuthenticated(true);
      } else {
        toast.error("Unexpected response status: " + res.status);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle redirect after state updates
  useEffect(() => {
    if (isAuthenticated && redirectPath) {
      console.log("useEffect triggered - Navigating to:", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, redirectPath, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName || !email || !password || !role) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    if (!validateEmailDomain(email)) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/register`,
        { fullName, email, password, role }
      );
      if (res.status === 200) {
        setIsOtpSent(true);
        toast.success(res.data.message);
        startTimer();
      } else if (res.status === 400) {
        toast.error("User already exists");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimerRunning(true);
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(intervalId);
          setTimerRunning(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/verify-otp`,
        { email, enteredOTP: otp, fullName, password }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setActiveTab("login");
      } else if (res.status === 400) {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to verify OTP");
      console.log(err);
    } finally {
      setVerifyLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "SMART GRID | USER LOGIN / SIGNUP";
  }, []);

  return (
    <form
      className="justify-center flex items-center flex-col bg-[#f9fafb] min-h-screen"
      onSubmit={(e) => {
        e.preventDefault();
        const activeTabElement = document.querySelector("[data-state='active']");
        const activeTabText = activeTabElement?.textContent;
        if (activeTabText === "Login") {
          handleLogin(e);
        } else if (activeTabText === "Sign Up") {
          handleSignup(e);
        }
      }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 font-grotesk">
          <TabsTrigger value="login" className={activeTab === "login" ? "bg-[#72B944] text-white" : ""}>
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className={activeTab === "signup" ? "bg-[#72B944] text-white" : ""}>
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="border border-gray-200 bg-[#f9fafb]">
            <CardHeader>
              <CardTitle className="font-grotesk">
                Welcome <span className="text-[#72B944] font-bold">User</span>
              </CardTitle>
              <CardDescription className="font-grotesk">
                Your Voice Matters – Report, Monitor, Improve!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1 font-grotesk">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  className="inputField"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1 font-grotesk">
                <Label htmlFor="password">Password</Label>
                <div className="w-full relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 inputField"
                    required
                  />
                  {showPassword ? (
                    <FaEye
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-3 cursor-pointer text-sm"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-3 cursor-pointer text-sm"
                    />
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#72B944] text-white font-grotesk" disabled={loading} type="submit">
                {loading ? (
                  <div className="flex flex-row gap-2 items-center font-grotesk">
                    <ImSpinner2 className="animate-spin text-white" /> Logging you in
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card className="border border-gray-200 bg-[#f9fafb]">
            <CardHeader>
              <CardTitle className="font-grotesk">
                Join <span className="text-green-600">SmartGrid</span>
              </CardTitle>
              <CardDescription className="font-grotesk">
                Stay Connected. Stay Informed. Shape Your City!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 font-grotesk">
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="inputField ml-10 bg-[#d1ebc9] text-black focus:outline-none focus:bg-[#d1ebc9] rounded-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" className="bg-[#d1ebc9]">Select Role</option>
                  <option value="admin" className="bg-[#d1ebc9]">Authority</option>
                  <option value="user" className="bg-[#d1ebc9]">Citizen</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter Full Name"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Create Password</Label>
                <div className="w-full relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                  />
                  {showPassword ? (
                    <FaEye
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-3 cursor-pointer text-sm"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={togglePasswordVisibility}
                      className="absolute right-2 top-3 cursor-pointer text-sm"
                    />
                  )}
                </div>
              </div>
              {isOtpSent && (
                <div className="space-y-1">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    type="number"
                    className="inputField"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the OTP"
                    required
                  />
                  <div>
                    {timerRunning && (
                      <span className="text-sm">{`Time remaining: ${Math.floor(
                        timer / 60
                      )}:${
                        timer % 60 < 10 ? "0" + (timer % 60) : timer % 60
                      }`}</span>
                    )}
                  </div>
                  <div className="gap-2 flex items-center">
                    <Button
                      disabled={verifyLoading}
                      className="w-full mt-2"
                      type="button"
                      onClick={handleVerifyOtp}
                    >
                      {verifyLoading ? (
                        <div className="flex flex-row gap-2 items-center">
                          <ImSpinner2 className="animate-spin" /> Verifying OTP
                        </div>
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                    <Button
                      disabled={loading}
                      className="w-full border mt-2"
                      variant="ghost"
                      type="button"
                      onClick={handleSignup}
                    >
                      {loading ? (
                        <div className="flex flex-row gap-2 items-center bg-[#72B944]">
                          <ImSpinner2 className="animate-spin" /> Resending OTP
                        </div>
                      ) : (
                        "Resend OTP"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#72B944] text-white" disabled={loading} type="submit">
                {loading ? (
                  <div className="flex flex-row gap-2 items-center font-grotesk">
                    <ImSpinner2 className="animate-spin text-white" /> Signing Up...
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default UserLogin;