import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Image,
  Text,
  Input,
  Button,
  VStack,
} from "@chakra-ui/react";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import "../Components/Login/login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://oxygenkart-backend.onrender.com/user/register",
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
        toast.success("Registration successful!");
        navigate("/"); // Navigate to home page on success
      }
    } catch (error) {
      toast.error("Error: Failed to register. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister({ email, password, username });
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
              <Text fontSize={"12px"} color={"gray"}>
                Already have an account?
              </Text>
              <Text
                fontSize={"12px"}
                color={"gray"}
                textDecoration={"underline"}
                ml={"5px"}
                onClick={() => navigate("/")}
                cursor={"pointer"}
              >
                SignIn
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
            borderRadius={"md"}
            boxShadow={"lg"}
            justifyContent={"space-between"}
          >
            <Box width={"50%"} p={8}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <Text fontSize={"2xl"} fontWeight={"bold"}>
                    Sign Up
                  </Text>
                  <Input
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isRequired
                  />
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
                  <Button
                    type="submit"
                    bg={"#00BDD6FF"}
                    isLoading={loading}
                    loadingText="Signing Up"
                    width={"100%"}
                    color={"white"}
                  >
                    Sign Up
                  </Button>
                </VStack>
              </form>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Register;
