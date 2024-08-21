import { Box, Grid, Flex, useToast, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import UserInput from "../Components/UserInput";

function AddUser({ isOpen, onClose }) {
  const { onOpen } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const validateFields = () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Title is a required field",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!description) {
      toast({
        title: "Error",
        description: "Description is a required field",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      toast({
        title: "Error",
        description: "Please provide a valid price",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    if (!video) {
      toast({
        title: "Error",
        description: "Please upload a video",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    const token = localStorage.getItem("token");

    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      if (video) {
        formData.append("courseVideo", video);
      }

      const response = await fetch(
        "https://oxy-admin-backend.onrender.com/course/add",
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add course");
      }

      toast({
        title: "Course added",
        description: "Course added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setTitle("");
      setDescription("");
      setPrice("");
      setVideo(null);
    } catch (error) {
      console.error("Error adding course:", error);
      toast({
        title: "Error",
        description: "Failed to add course",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w={"75%"}>
      <Drawer onClose={onClose} isOpen={isOpen} placement="bottom">
        <DrawerOverlay />
        <DrawerContent
          style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
        >
          <DrawerCloseButton />
          <DrawerHeader
            fontWeight={"bold"}
            color={"black"}
            fontSize={"18px"}
            bg={"#EEEEEE"}
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            ADD NEW COURSE
          </DrawerHeader>
          <DrawerBody>
            <Box mt={"25px"}>
              <Grid templateColumns="repeat(1, 1fr)" gap={6}>
                <UserInput
                  placeholder="Course Title*"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <UserInput
                  placeholder="Course Description*"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <UserInput
                  placeholder="Course Price*"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <input
                  type="file"
                  accept="video/*" // Update to accept video files
                  onChange={handleVideoChange}
                />
              </Grid>
              <Flex
                alignItems={"end"}
                justifyContent={"end"}
                mt={"40px"}
                mb={"20px"}
              >
                <Button
                  size={"lg"}
                  bg={"black"}
                  color={"white"}
                  _hover={{ bg: "gray.700" }}
                  fontSize={"17px"}
                  onClick={handleRegister}
                  isDisabled={loading} // Disable button while loading
                >
                  {loading ? <Spinner size="sm" /> : "Add Course"}
                </Button>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default AddUser;
