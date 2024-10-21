import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Spinner,
  Button,
  Flex,
} from "@chakra-ui/react";

function ChatPayment() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Set number of items per page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://oxygenkart-backend.onrender.com/payment/get-All-payment",
        {
          method: "GET",
          headers: {
            Authorization: `${token}`, // Ensure Authorization format is correct
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();
      setPayments(data.payments);

      setTotalPages(Math.ceil(data.payments.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to fetch payments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/chatPayments/delete/${paymentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.ok) {
        setPayments(payments.filter((payment) => payment._id !== paymentId));
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      setError("Failed to delete payment. Please try again.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100%"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt="10px" textAlign="center" width="100%">
        <Box color="red.500">Error: {error}</Box>
      </Box>
    );
  }

  return (
    <Box mt="10px" width="100%">
      <VStack spacing={4} width="100%">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Payment ID</Th>
              <Th>Email</Th>
              <Th>Username</Th>
              <Th>Amount (₹)</Th>
              <Th>Date</Th>
              {/* <Th>Action</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {currentPayments.map((payment) => (
              <Tr key={payment.paymentId}>
                <Td>{payment.paymentId}</Td>
                <Td>{payment.email}</Td>
                <Td>{payment.username}</Td>
                <Td>₹{payment.amount}</Td>
                <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                {/* <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeletePayment(payment.paymentId)}
                  >
                    Delete
                  </Button>
                </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Flex justifyContent="center" mt={4}>
          {Array.from({ length: totalPages }).map((_, index) => (
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

export default ChatPayment;
