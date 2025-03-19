import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { SIGNUP_ROUTE } from "@/utils/constant";
import { LOGIN_ROUTE } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { userAppStore } from "../../store";

// Main auth
function Auth() {
  const navigate = useNavigate();
  const { setUserInfo } = userAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const loginValidate = () => {
    if (!email.length) {
      toast.error("Email is Required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is Required");
      return false;
    }

    return true;
  };

  // SignupValidate

  const signupValidate = () => {
    if (!email.length) {
      toast.error("Email is Required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is Required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm password should be same");
      return false;
    }
    return true;
  };
  // Login handling

  const handleLogin = async () => {
    if (loginValidate()) {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetUp) navigate("/chat");
        else navigate("/profile");
      }
      console.log({ response });
    }
  };

  // Handling signup
  const handleSignup = async () => {
    if (signupValidate()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        {
          email,
          password,
        },

        { withCredentials: true }
      );
      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/profile");
      }
      console.log({ response });
    }
  };
  // auth main return page
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className="w-[80vw] h-[80vh] border-2 shadow-2xl bg-white border-white text-opacity-90 md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
        <div className="flex flex-col items-center gap-10 justify-center">
          <div className="flex items-center justify-center flex-col mx-4 gap-2">
            <div className="flex items-center justify-center ">
              <h1 className="text-4xl font-bold md:text-6xl ">Welcome👋</h1>
            </div>
            <p className="text-sm md:text-xl text-center">
              Fill the details to get started with chat app
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            {/* Tabs list both signup and login  */}
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black data-[state=active]:font-semibold data-[state=active]:border-b-black p-3 transition-all duration-300 text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black data-[state=active]:font-semibold data-[state=active]:border-b-black p-3 transition-all duration-300 text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              {/* Tabs content for both login and signup  */}
              {/* login  */}
              <TabsContent value="login" className="flex flex-col gap-4 mt-5">
                <Input
                  value={email}
                  placeholder="Email"
                  type="email"
                  className="rounded-xl p-4 md:p-6"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  value={password}
                  placeholder="Password"
                  type="password"
                  className="rounded-xl p-4 md:p-6"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-4 md:p-6"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>
              {/* signup  */}
              <TabsContent value="signup" className="flex flex-col gap-4 mt-5 ">
                <Input
                  value={email}
                  placeholder="Email"
                  type="email"
                  className="rounded-xl p-4 md:p-6"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  value={password}
                  placeholder="Password"
                  type="password"
                  className="rounded-xl p-4 md:p-6"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-xl p-4 md:p-6"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-4 md:p-6"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex items-center justify-center">
          {" "}
          <img src="/login-page-picture.jpg" alt="" className="w-[700px]" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
