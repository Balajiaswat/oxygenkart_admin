import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Text,
  VStack,
  Input,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { SlideFade } from "@chakra-ui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [editMode, setEditMode] = useState(null); // Track currently editing course ID
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [actionLoading, setActionLoading] = useState(null); // Track loading state for each action (edit, save, delete)

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://oxygenkart-backend.onrender.com/course/get",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data); // Assuming response format has 'courses' array
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false); // Always set loading to false when done (success or error)
    }
  };

  const handleDelete = async (courseId) => {
    setActionLoading(courseId); // Set loading to true for the delete action
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://oxygenkart-backend.onrender.com/course/delete/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      // Remove deleted course from state
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success("Course deleted successfully");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    } finally {
      setActionLoading(null); // Set loading to false after delete operation
    }
  };

  const handleUpdate = async (courseId, updatedData) => {
    setActionLoading(courseId); // Set loading to true for the update action
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", updatedData.title);
      formData.append("description", updatedData.description);
      formData.append("price", updatedData.price);
      if (updatedData.video) {
        formData.append("courseVideo", updatedData.video);
      }

      const response = await fetch(
        `https://oxygenkart-backend.onrender.com/course/update/${courseId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      // Update course in state with the updated data
      const updatedCourse = await response.json();
      setCourses(
        courses.map((course) =>
          course._id === courseId ? { ...updatedCourse } : course
        )
      );
      setEditMode(null);
      toast.success("Course updated successfully");
      fetchCourses(); // Refresh courses after update
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    } finally {
      setActionLoading(null); // Set loading to false after update operation
    }
  };

  const handleEditClick = (courseId) => {
    setEditMode(courseId); // Set the current course ID in edit mode
  };

  const handleCancelEdit = () => {
    setEditMode(null); // Exit edit mode
  };

  const handleInputChange = (e, field, courseId) => {
    const updatedValue = e.target.value;
    setCourses(
      courses.map((course) =>
        course._id === courseId ? { ...course, [field]: updatedValue } : course
      )
    );
  };

  const handleVideoChange = (e, courseId) => {
    const updatedVideo = e.target.files[0];
    setCourses(
      courses.map((course) =>
        course._id === courseId ? { ...course, video: updatedVideo } : course
      )
    );
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width={"100%"}
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Flex justify="center" p={4} width={"100%"}>
      <Grid
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        gap={2}
        width="100%"
      >
        {courses.map((course) => (
          <Box
            key={course._id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            p={4}
            textAlign={"center"}
          >
            {editMode === course._id ? (
              <VStack align="stretch" spacing={4} mt={4}>
                <Input
                  placeholder="Title"
                  value={course.title}
                  onChange={(e) => handleInputChange(e, "title", course._id)}
                />
                <Textarea
                  placeholder="Description"
                  value={course.description}
                  onChange={(e) =>
                    handleInputChange(e, "description", course._id)
                  }
                />
                <Input
                  placeholder="Price"
                  value={course.price}
                  onChange={(e) => handleInputChange(e, "price", course._id)}
                />
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoChange(e, course._id)}
                />
                {course.video && typeof course.video !== "string" && (
                  <video
                    controls
                    height={"300px"}
                    width={"100%"}
                    src={URL.createObjectURL(course.video)}
                    alt={course.title}
                    mt={2}
                  />
                )}
                <Flex justify="space-between" mt={4}>
                  <SlideFade in={true} offsetY="20px">
                    <Button
                      colorScheme="green"
                      onClick={() => handleUpdate(course._id, course)}
                      isLoading={actionLoading === course._id}
                    >
                      Save
                    </Button>
                  </SlideFade>
                  <SlideFade in={true} offsetY="20px">
                    <Button colorScheme="gray" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </SlideFade>
                </Flex>
              </VStack>
            ) : (
              <>
                {typeof course.video === "string" ? (
                  <video
                    controls
                    height={"300px"}
                    src={course.video}
                    alt={course.title}
                    width={"100%"}
                  />
                ) : (
                  <Image
                    height={"150px"}
                    src={typeof course.image === "string" ? course.image : ""}
                    alt={course.title}
                    width={"100%"}
                  />
                )}
                <Text fontWeight="bold" fontSize="small" mt={2}>
                  {course.title}
                </Text>
                <Text color="gray.600" fontSize={"small"}>
                  {course.description}
                </Text>
                <Text color="gray.600">Price : {course.price}</Text>
                {/* <Text color="gray.500" mt={2}>
                  {` Created on ${new Date(course.date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}`}
                </Text> */}
                <Flex justify="space-between" mt={4}>
                  <SlideFade in={true} offsetY="20px">
                    <Button
                      leftIcon={<FaEdit />}
                      colorScheme="blue"
                      onClick={() => handleEditClick(course._id)}
                    >
                      Edit
                    </Button>
                  </SlideFade>
                  <SlideFade in={true} offsetY="20px">
                    <Button
                      leftIcon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleDelete(course._id)}
                      isLoading={actionLoading === course._id}
                    >
                      Delete
                    </Button>
                  </SlideFade>
                </Flex>
              </>
            )}
          </Box>
        ))}
      </Grid>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Flex>
  );
};

export default Course;
