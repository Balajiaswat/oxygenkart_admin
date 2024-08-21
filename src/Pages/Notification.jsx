import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  VStack,
  Input,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { SlideFade } from "@chakra-ui/react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [editMode, setEditMode] = useState(null); // Track currently editing notification ID
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [newMessage, setNewMessage] = useState(""); // State for new notification message
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await fetch(
        "https://oxygenkart-backend.onrender.com/notification/get",
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false); // Always set loading to false when done (success or error)
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (notificationId) => {
    setLoading(true); // Set loading to true when deleting
    try {
      const response = await fetch(
        `https://oxygenkart-backend.onrender.com/notification/delete/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Remove deleted notification from state
      setNotifications(
        notifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
      console.log("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
    } finally {
      setLoading(false); // Set loading to false after delete operation
    }
  };

  const handleUpdate = async (notificationId, updatedMessage) => {
    setLoading(true); // Set loading to true when updating
    try {
      const response = await fetch(
        `https://oxygenkart-backend.onrender.com/notification/update/${notificationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",

            Authorization: token,
          },
          body: JSON.stringify({ message: updatedMessage }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update notification");
      }

      // Update notification in state with the updated data
      const updatedNotification = await response.json();
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId
            ? { ...updatedNotification.notification }
            : notification
        )
      );
      setEditMode(null);
    } catch (error) {
      console.error("Error updating notification:", error);
    } finally {
      setLoading(false); // Set loading to false after update operation
    }
  };

  const handleEditClick = (notificationId) => {
    setEditMode(notificationId); // Set the current notification ID in edit mode
  };

  const handleCancelEdit = () => {
    setEditMode(null); // Exit edit mode
  };

  const handleInputChange = (e, notificationId) => {
    const updatedMessage = e.target.value;
    setNotifications(
      notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, message: updatedMessage }
          : notification
      )
    );
  };

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleAddNotification = async () => {
    setLoading(true); // Set loading to true when adding
    try {
      const response = await fetch(
        "https://oxygenkart-backend.onrender.com/notification/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ message: newMessage }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add notification");
      }

      const newNotification = await response.json();
      setNotifications([...notifications, newNotification.notification]);
      setNewMessage(""); // Clear the input field after adding
    } catch (error) {
      console.error("Error adding notification:", error);
    } finally {
      setLoading(false); // Set loading to false after add operation
    }
  };

  return (
    <Flex justify="center" p={4} width={"100%"}>
      <VStack spacing={4} width="100%">
        <Flex width="100%" justify="space-between">
          <Input
            placeholder="Enter new notification message"
            value={newMessage}
            onChange={handleNewMessageChange}
            width="80%"
          />
          <Button
            colorScheme="blue"
            onClick={handleAddNotification}
            isLoading={loading}
          >
            Add Notification
          </Button>
        </Flex>

        <Grid
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={4}
          width="100%"
        >
          {loading ? (
            // Display colorful spinner while loading
            <Flex
              justify="center"
              alignItems="center"
              width="100%"
              margin={"auto"}
            >
              <Spinner
                size="xl"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500" // Change spinner color
              />
            </Flex>
          ) : (
            // Display notifications if not loading
            notifications.map((notification) => (
              <Box
                key={notification._id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                p={4}
                textAlign={"center"}
              >
                {editMode === notification._id ? (
                  <VStack align="stretch" spacing={4} mt={4}>
                    <Textarea
                      placeholder="Message"
                      value={notification.message}
                      onChange={(e) => handleInputChange(e, notification._id)}
                    />
                    <Flex justify="space-between" mt={4}>
                      <SlideFade in={true} offsetY="20px">
                        <Button
                          colorScheme="green"
                          onClick={() =>
                            handleUpdate(notification._id, notification.message)
                          }
                          isLoading={loading}
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
                    <Text fontSize="small" mt={2}>
                      {notification.message}
                    </Text>
                    <Text color="gray.500" mt={2}>
                      {`Created on ${new Date(
                        notification.date
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}`}
                    </Text>
                    <Flex justify="space-between" mt={4}>
                      <SlideFade in={true} offsetY="20px">
                        <Button
                          leftIcon={<FaEdit />}
                          colorScheme="blue"
                          onClick={() => handleEditClick(notification._id)}
                        >
                          Edit
                        </Button>
                      </SlideFade>
                      <SlideFade in={true} offsetY="20px">
                        <Button
                          leftIcon={<FaTrash />}
                          colorScheme="red"
                          onClick={() => handleDelete(notification._id)}
                        >
                          Delete
                        </Button>
                      </SlideFade>
                    </Flex>
                  </>
                )}
              </Box>
            ))
          )}
        </Grid>
      </VStack>
    </Flex>
  );
};

export default Notification;
