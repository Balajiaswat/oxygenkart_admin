import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Flex,
} from "@chakra-ui/react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false); // State for loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch(
        `https://oxygenkart-backend.onrender.com/user/getuserbyemail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const userData = await response.json();
        const { _id } = userData;

        // Navigate to reset password page with _id as a route parameter
        navigate(`/reset/${_id}`);
      } else {
        // Email not found or other error
        toast.error("Email not found. Please enter a valid email.");
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      toast.error("Failed to submit email. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      backgroundColor="gray.100"
    >
      <Box
        p={8}
        maxWidth="600px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        backgroundColor="white"
        width={"100%"}
      >
        <Heading as="h2" size="lg" mb={4}>
          Forgot Password
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormLabel htmlFor="email" fontSize="sm" color="gray.500">
            Enter your registered email address
          </FormLabel>
          <FormControl>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

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
      <ToastContainer />
    </Flex>
  );
}

export default ForgotPassword;
