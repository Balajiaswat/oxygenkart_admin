import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Text,
  Input,
  Button,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (token && isLoggedIn) {
      navigate("/dashboard/user");
    }
  }, []);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://oxy-admin-backend.onrender.com/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.status === 403) {
        toast.error("Invalid Credentials: Email or password is incorrect");
        return;
      }

      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData.user.user.admin);
        if (!responseData.user.user.admin) {
          toast.error("You are not authorized to access this page");
          return;
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", responseData.token);
        // localStorage.setItem("userId", responseData.user.userId);
        navigate("/dashboard/user"); // Adjust this based on your routing setup
      }
    } catch (error) {
      toast.error("Error: Failed to login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <>
      <ToastContainer />
      <Box className="container" style={{ background: "#fff" }}>
        <Box width={"95%"} margin={"auto"}>
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            pt={"20px"}
          >
            <Box>
              <Image
                src="https://instalingual-app-new.s3.amazonaws.com/images/0ef3aa87-b54a-4c47-860a-dc1c4f2f7aac-Image.jpg"
                width={"40%"}
              />
            </Box>
            <Flex>
              <Text fontSize={"12px"} color={"white"}>
                Don't have an account?
              </Text>
              <Text
                fontSize={"12px"}
                color={"white"}
                textDecoration={"underline"}
                ml={"5px"}
                onClick={() => navigate("/register")}
                cursor={"pointer"}
              >
                Signup
              </Text>
            </Flex>
          </Flex>

          <Flex
            position={"absolute"}
            top={"50%"}
            left={"50%"}
            transform={"translate(-50%,-50%)"}
            width={"100%"}
            maxW={"800px"}
            bg={"white"}
            // p={8}
            borderRadius={"md"}
            boxShadow={"lg"}
            justifyContent={"space-between"}
          >
            <Box width={"50%"} p={8}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <Text fontSize={"2xl"} fontWeight={"bold"}>
                    Sign In
                  </Text>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isRequired
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isRequired
                  />
                  <Flex
                    width={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Checkbox>Remember me</Checkbox>
                    <Text
                      fontSize={"sm"}
                      color={"blue.500"}
                      cursor={"pointer"}
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot Password?
                    </Text>
                  </Flex>

                  <Button
                    type="submit"
                    bg={"#00BDD6FF"}
                    isLoading={loading}
                    loadingText="Signing In"
                    width={"100%"}
                    color={"white"}
                  >
                    Sign In
                  </Button>

                  {/* <Text fontSize={"sm"}>or sign in with</Text>
                  <Flex
                    width={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-around"}
                  >
                    <Button
                      leftIcon={<FaGoogle />}
                      colorScheme="red"
                      iconSpacing={0}
                      borderRadius={"30px"}
                      width={"30%"}
                    ></Button>
                    <Button
                      leftIcon={<FaFacebook />}
                      colorScheme="facebook"
                      iconSpacing={0}
                      borderRadius={"30px"}
                      width={"30%"}
                    ></Button>
                    <Button
                      leftIcon={<FaApple />}
                      colorScheme="blackAlpha"
                      iconSpacing={0}
                      borderRadius={"30px"}
                      width={"30%"}
                    ></Button>
                  </Flex> */}
                </VStack>
              </form>
            </Box>
            <Box width={"45%"} bg={"#00BDD6FF"} p={4} borderRadius={"md"}>
              <Image src="/lgi.jpg" width={"100%"} height={"100%"} />
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Login;
