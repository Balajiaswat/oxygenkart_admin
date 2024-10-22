import React, { useState, useEffect, useCallback } from "react";

import {
  Button,
  useDisclosure,
  Text,
  Flex,
  Box,
  Grid,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Spinner,
} from "@chakra-ui/react";
import { IoMdArrowDropup } from "react-icons/io";
import AddUser from "./AddUser";
import BarChart from "../Components/BarChart";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = localStorage.getItem("token");
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://oxygenkart-backend.onrender.com/payment/combine",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchOrders = useCallback(async () => {
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
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [token]); // Include token as a dependency

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Include fetchOrders in dependency array

  // Fetch payments (memoized)
  const fetchPayments = useCallback(async () => {
    try {
      const response = await fetch(
        "https://oxygenkart-backend.onrender.com/payment/get-All-payment",
        {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();
      setPayments(data.payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  }, [token]); // Include token as a dependency

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]); // Include fetchPayments in dependency array

  // Fetch all users (memoized)
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://oxygenkart-backend.onrender.com/user/getalluser",
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.reverse());
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [token]); // Include token as a dependency

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]); // Include fetchAllUsers in dependency array

  // Logout function
  const logout = async () => {
    try {
      if (!token) {
        toast.error("No token found, you are not logged in.");
        return;
      }

      const response = await fetch(
        "https://oxygenkart-backend.onrender.com/user/logout",
        {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        toast.success("Logout successful!");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(`Logout failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      toast.error("An error occurred while logging out.");
      console.error("Logout error:", error);
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get the current items to display
  const currentItems = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div style={{ width: "80%", paddingBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          Dashboard
        </Text>
        <Flex alignItems={"end"} justifyContent={"end"}>
          <Button
            onClick={onOpen}
            bg={"gray.100"}
            color={"black"}
            _hover={{ bg: "gray.700", color: "white" }}
            fontSize={"11px"}
            padding={"10px"}
            height={"30px"}
          >
            Create Course
          </Button>
          <Button
            onClick={logout}
            bg={"gray.100"}
            color={"black"}
            _hover={{ bg: "gray.700", color: "white" }}
            fontSize={"11px"}
            marginLeft={"20px"}
            height={"30px"}
          >
            Logout
          </Button>
        </Flex>
      </div>

      <Flex
        alignItems={"start"}
        justifyContent={"space-between"}
        mt={"20px"}
        gap={"10px"}
      >
        <Box width={"70%"}>
          <Grid
            // style={{ border: "1px solid" }}
            templateColumns="repeat(3, 1fr)"
            gap={6}
          >
            <Box
              borderRadius={"10px"}
              backgroundColor={"#F5F5F5"}
              padding={"10px"}
            >
              <Text fontSize={"12px"} fontFamily={"sans-serif"}>
                Customers
              </Text>
              <Text
                fontSize={"22px"}
                fontWeight={"bold"}
                fontFamily={"sans-serif"}
              >
                {users.length}
              </Text>
              <Flex alignItems={"center"}>
                <IoMdArrowDropup
                  fontSize={"10px"}
                  fontFamily={"sans-serif"}
                  color="green"
                  fontWeight={"700"}
                />
                <Text color="green" fontWeight={"700"} fontSize={"12px"}>
                  5.39 %
                </Text>
              </Flex>
            </Box>
            <Box
              borderRadius={"10px"}
              backgroundColor={"#E0F2F1"}
              padding={"10px"}
            >
              <Text fontSize={"12px"} fontFamily={"sans-serif"}>
                Chat Payments
              </Text>
              <Text
                fontSize={"22px"}
                fontWeight={"bold"}
                fontFamily={"sans-serif"}
              >
                {payments.length}
              </Text>
              <Flex alignItems={"center"}>
                <IoMdArrowDropup color="red" />
                <Text color="red" fontWeight={"700"} fontSize={"12px"}>
                  5.39 %
                </Text>
              </Flex>
            </Box>
            <Box
              borderRadius={"10px"}
              backgroundColor={"#FFEBEE"}
              padding={"10px"}
            >
              <Text fontSize={"12px"} fontFamily={"sans-serif"}>
                Course Orders
              </Text>
              <Text
                fontSize={"22px"}
                fontWeight={"bold"}
                fontFamily={"sans-serif"}
              >
                {orders.length}
              </Text>
              <Flex alignItems={"center"}>
                <IoMdArrowDropup />
                <Text color="green" fontWeight={"700"} fontSize={"12px"}>
                  5.39 %
                </Text>
              </Flex>
            </Box>
          </Grid>
          <BarChart />

          {/* Recent orders */}
          <Box border={"1px solid gray.100"} borderRadius={"5px"}>
            <Table variant="simple">
              <Thead>
                <Tr bg="gray.100" borderRadius={"5px"}>
                  <Th>Item</Th>
                  <Th>Date</Th>
                  <Th>Price</Th>
                  <Th>Payment</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.type}</Td>
                    <Td>{new Date(item.date).toLocaleString()}</Td>
                    <Td>
                      {item.type === "CourseOrder"
                        ? `₹${item.courseId.price}`
                        : `₹${item.amount / 100}`}{" "}
                      {/* Display amount in rupees */}
                    </Td>
                    <Td style={{ display: "flex" }}>
                      <CheckCircleIcon color="green.500" ml={1} mr={2} />
                      Success
                    </Td>
                    <Td>Completed</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Flex justify="space-between" mt={4}>
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                isDisabled={currentPage === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                isDisabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </Flex>
            <Box mt={2}>
              Page {currentPage + 1} of {totalPages}
            </Box>
          </Box>
        </Box>

        <Box
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
          }}
          boxShadow={"md"}
          width={"30%"}
        >
          <Box>
            <Flex
              alignItems={"start"}
              justifyContent={"space-between"}
              padding={"10px"}
            >
              <Box>
                <Text fontWeight={"700"} fontFamily={"sans-serif"}>
                  Recent Users
                </Text>
              </Box>
              {/* <Box width={"55%"} bg={"gray.100"} borderRadius={"5px"}>
                <Flex
                  alignItems={"start"}
                  justifyContent={"space-between"}
                  padding={"3px 0 3px 0"}
                >
                  <InputGroup size={"sm"}>
                    <InputLeftElement pointerEvents="none">
                      <SlCalender
                        fontSize={"12px"}
                        style={{ marginBottom: "5px" }}
                      />
                    </InputLeftElement>
                    <Select
                      size="sm"
                      padding={"0"}
                      placeholder="Mothly"
                      ml={"40px"}
                      variant="unstyled"
                      sx={{
                        border: "none",
                      }}
                      cursor={"pointer"}
                    >
                      <option value="month">Month</option>
                      <option value="jan">Jan</option>
                      <option value="feb">Feb</option>
                     
                    </Select>
                  </InputGroup>
                </Flex>
              </Box> */}
            </Flex>
          </Box>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={"100%"}
            >
              <Spinner size="xl" />
            </Box>
          ) : (
            users?.slice(0, 5).map((user) => (
              <Box
                key={user._id} // Make sure to add a unique key for each element in the list
                width={"90%"}
                margin={"auto"}
                bg={"gray.100"}
                borderRadius={"10px"}
                mb={"20px"}
                p={"10px"}
              >
                <Flex alignItems={"center"} gap={"10px"}>
                  <Box>
                    <Text fontWeight={"700"} fontFamily={"sans-serif"}>
                      {user.username}
                    </Text>
                    <Text fontSize={"14px"}>{user.email}</Text>
                  </Box>
                </Flex>
              </Box>
            ))
          )}
        </Box>
      </Flex>

      {/* <UserTable users={currentUsers} loading={loading} />
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={users.length}
        paginate={paginate}
      /> */}
      <AddUser isOpen={isOpen} onClose={onClose} />
    </div>
  );
}

export default User;
