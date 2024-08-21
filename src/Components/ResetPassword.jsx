import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  IconButton,
  InputGroup,
  InputRightElement,
  Flex,
} from "@chakra-ui/react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate passwords
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // API call to change password
      const response = await fetch(
        `https://oxy-admin-backend.onrender.com/user/change-password/${id}`, // Replace with your actual endpoint
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword: password, confirmPassword }),
        }
      );

      if (response.ok) {
        toast.success("Password changed successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        backgroundColor="gray.100"
      >
        <Box
          p={8}
          maxWidth="600px"
          width={"100%"}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          backgroundColor="white"
        >
          <Heading as="h2" size="lg" mb={4}>
            Change Password
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormLabel htmlFor="password" fontSize="sm" color="gray.500">
              Enter new password
            </FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  icon={showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  onClick={() => togglePasswordVisibility("password")}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
            <FormLabel
              htmlFor="confirmPassword"
              fontSize="sm"
              color="gray.500"
              mt={4}
            >
              Re-enter password
            </FormLabel>
            <InputGroup>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <InputRightElement>
                <IconButton
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  icon={showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
            <Button
              type="submit"
              colorScheme="blue"
              mt={4}
              isLoading={isLoading}
              loadingText="Submitting"
            >
              Submit
            </Button>
          </form>
        </Box>
      </Flex>
      <ToastContainer />
    </>
  );
}

export default ResetPassword;
