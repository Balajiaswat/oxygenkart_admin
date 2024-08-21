import React, { useState, useEffect } from "react";

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://oxy-admin-backend.onrender.com/user/getalluser",
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
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found, you are not logged in.");
        return;
      }

      const response = await fetch(
        `https://oxy-admin-backend.onrender.com/user/logout`,
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
                Data label
              </Text>
              <Text
                fontSize={"22px"}
                fontWeight={"bold"}
                fontFamily={"sans-serif"}
              >
                42,502
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
                Revenue
              </Text>
              <Text
                fontSize={"22px"}
                fontWeight={"bold"}
                fontFamily={"sans-serif"}
              >
                56,201
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
                <Tr bg="gray.100" borderRadius="5px">
                  <Th>Item</Th>
                  <Th>Date</Th>
                  <Th>Price</Th>
                  <Th>Payment</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* Example row */}
                <Tr>
                  <Td>Item 1</Td>
                  <Td>2024-06-17</Td>
                  <Td>$50.00</Td>
                  <Td>
                    <CheckCircleIcon color="green.500" ml={1} mr={2} />
                    Transfered
                  </Td>
                  <Td>Completed</Td>
                </Tr>
                <Tr>
                  <Td>Item 1</Td>
                  <Td>2024-06-17</Td>
                  <Td>$50.00</Td>
                  <Td>
                    <CheckCircleIcon color="green.500" ml={1} mr={2} />
                    Transfered
                  </Td>
                  <Td>Completed</Td>
                </Tr>
                <Tr>
                  <Td>Item 1</Td>
                  <Td>2024-06-17</Td>
                  <Td>$50.00</Td>
                  <Td>
                    <CheckCircleIcon color="green.500" ml={1} mr={2} />
                    Transfered
                  </Td>
                  <Td>Completed</Td>
                </Tr>
                {/* Add more rows as needed */}
              </Tbody>
            </Table>
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
