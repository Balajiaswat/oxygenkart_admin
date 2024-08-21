import React, { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
} from "@chakra-ui/react";

function ContactUs() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          "https://oxy-admin-backend.onrender.com/contactus/get",
          {
            method: "GET",
            headers: {
              Authorization: token,
            },
          }
        ); // Adjust the URL as needed
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setContacts(data.reverse()); // Reverse to show the latest first
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

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

  if (contacts.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width={"100%"}
      >
        <Heading>No support messages</Heading>
      </Box>
    );
  }

  return (
    <Box p={5} width={"100%"}>
      <Heading textAlign={"center"} mb={5}>
        Contact Us Messages
      </Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Message</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {contacts.map((contact) => (
              <Tr key={contact._id}>
                <Td>{contact.firstName}</Td>
                <Td>{contact.lastName}</Td>
                <Td>{contact.email}</Td>
                <Td>{contact.message}</Td>
                <Td>{new Date(contact.createdAt).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ContactUs;
