import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  VStack,
  Spinner,
  Center,
  ScaleFade,
  Button,
  Flex,
} from "@chakra-ui/react";

function CourseOrder() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Changed to itemsPerPage for consistency
  const [totalPages, setTotalPages] = useState(0); // State to hold total pages
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []); // Fetch orders on initial load

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://oxygenkart-backend.onrender.com/courseOrder/get",
        {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      console.log(data);
      setOrders(data.orders);

      setTotalPages(Math.ceil(data.orders.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // Simulating delete operation
      const response = await fetch(
        `https://oxygenkart-backend.onrender.com/courseOrder/delete/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete order. Please try again.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  if (error) {
    return (
      <Box mt={"10px"} textAlign="center" width={"100%"}>
        <Box color="red.500">Error: {error}</Box>
      </Box>
    );
  }

  return (
    <Box mt={"10px"} width={"100%"}>
      <VStack spacing={4} width="100%">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Course Media</Th>
              <Th>Email</Th>
              <Th>Username</Th>
              <Th>Course Title</Th>
              <Th>Price</Th>
              <Th>Payment Success</Th>
              <Th>Order Date</Th>
              {/* <Th>Action</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {currentOrders?.map((order) => (
              <Tr key={order._id}>
                <Td>
                  <Box display="flex" alignItems="center">
                    {order.courseId.video ? (
                      <video
                        controls
                        src={order.courseId.video}
                        alt="Course Video"
                        width="250px"
                        height="auto"
                        style={{ marginRight: "30px" }}
                      />
                    ) : null}
                  </Box>
                </Td>
                <Td>{order.userId.email}</Td>
                <Td>{order.userId.username}</Td>
                <Td>{order.courseId.title}</Td>
                <Td>${order.courseId.price}</Td>
                <Td>{order.paymentSuccess ? "Yes" : "No"}</Td>
                <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                {/* <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteOrder(order._id)}
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

export default CourseOrder;
