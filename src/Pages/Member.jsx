import React, { useState, useEffect } from "react";

import Pagination from "../Components/Pagination";
import UserTable from "../Components/UserTable";
import { Button, useDisclosure, Text, Flex } from "@chakra-ui/react";
import AddUser from "./AddUser";

function User() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
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
      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ width: "80%" }}>
      <UserTable users={currentUsers} loading={loading} />
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={users.length}
        paginate={paginate}
      />
      <AddUser isOpen={isOpen} onClose={onClose} />
    </div>
  );
}

export default User;
