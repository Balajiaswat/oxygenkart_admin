import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  useToast,
  Heading,
  VStack,
  Text,
  IconButton,
  StackDivider,
  Divider,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";

function Message() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(3);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://oxy-admin-backend.onrender.com/message/get"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      // Sort messages by created_at in descending order
      const sortedMessages = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(
        "https://oxy-admin-backend.onrender.com/message/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast({
        title: "Success",
        description: "Message sent successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setMessage("");
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = (msg) => {
    setEditingMessage(msg);
  };

  const handleSaveMessage = async () => {
    if (!editingMessage.message.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `https://oxy-admin-backend.onrender.com/message/update/${editingMessage._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            message: editingMessage.message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update message");
      }

      toast({
        title: "Success",
        description: "Message updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setEditingMessage(null);
      fetchMessages();
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(
        `https://oxy-admin-backend.onrender.com/message/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      toast({
        title: "Success",
        description: "Message deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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

  // Get current messages
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Box
      maxW="800px"
      mx="auto"
      mt="50px"
      p="20px"
      width={"100%"}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="md" textAlign={"center"}>
          Send a Message
        </Heading>
        <Flex flexDirection={"column"}>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            mb={2}
            padding={2}
          />

          <Button
            onClick={handleSendMessage}
            colorScheme="teal"
            isLoading={isSending}
            loadingText="Sending"
            ml="2"
            mt={2}
          >
            Send
          </Button>
        </Flex>
        <Divider />
        <VStack
          spacing={4}
          align="stretch"
          divider={<StackDivider borderColor="gray.200" />}
        >
          {currentMessages.map((msg) => (
            <Box key={msg._id} p={4} borderWidth="1px" borderRadius="lg">
              {editingMessage && editingMessage._id === msg._id ? (
                <>
                  <Textarea
                    value={editingMessage.message}
                    onChange={(e) =>
                      setEditingMessage({
                        ...editingMessage,
                        message: e.target.value,
                      })
                    }
                    placeholder="Edit message..."
                    mt={2}
                  />
                  <Flex mt={2}>
                    <Button
                      colorScheme="blue"
                      onClick={handleSaveMessage}
                      mr={2}
                    >
                      Save
                    </Button>
                    <Button
                      colorScheme="gray"
                      onClick={() => setEditingMessage(null)}
                    >
                      Cancel
                    </Button>
                  </Flex>
                </>
              ) : (
                <>
                  <Flex justifyContent={"space-between"}>
                    <Box>
                      <Text>{msg.message}</Text>
                      <Text color="gray.500">
                        Sent on {new Date(msg.created_at).toLocaleString()}
                      </Text>
                    </Box>
                    <Flex mt={2}>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit"
                        colorScheme="blue"
                        onClick={() => handleEditMessage(msg)}
                        mr={2}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        aria-label="Delete"
                        colorScheme="red"
                        onClick={() => handleDeleteMessage(msg._id)}
                      />
                    </Flex>
                  </Flex>
                </>
              )}
            </Box>
          ))}
        </VStack>
        <Flex justifyContent="center" mt={4}>
          {Array.from({
            length: Math.ceil(messages.length / messagesPerPage),
          }).map((_, index) => (
            <Button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              colorScheme={index + 1 === currentPage ? "teal" : "gray"}
              m={1}
            >
              {index + 1}
            </Button>
          ))}
        </Flex>
      </VStack>
    </Box>
  );
}

export default Message;
