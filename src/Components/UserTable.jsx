import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function UserTable({ users, loading }) {
  const [sortByName, setSortByName] = useState("");
  const [sortByEmail, setSortByEmail] = useState("");
  const [nameOrder, setNameOrder] = useState("Asc");
  const [emailOrder, setEmailOrder] = useState("Asc");
  const [editIndex, setEditIndex] = useState(null);

  const [editData, setEditData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const handleSort = (e) => {
    const { name, value } = e.target;
    if (name === "sortByName") {
      setSortByName(value);
      setSortByEmail("");
    } else {
      setSortByEmail(value);
      setSortByName("");
    }
  };

  const handleOrder = (e) => {
    const { name, value } = e.target;
    if (name === "nameOrder") {
      setNameOrder(value);
    } else {
      setEmailOrder(value);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortByName === "name") {
      const comparison = a.username.localeCompare(b.username);
      return nameOrder === "Asc" ? comparison : -comparison;
    }
    if (sortByEmail === "email") {
      const comparison = a.email.localeCompare(b.email);
      return emailOrder === "Asc" ? comparison : -comparison;
    }
    return 0;
  });

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...users[index] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    users[editIndex] = editData;
    setEditIndex(null);
  };

  return (
    <table
      style={{
        width: "100%",
        boxShadow:
          "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
        borderCollapse: "collapse",
        borderRadius: "10px",
        marginTop: "30px",
      }}
    >
      <thead>
        <tr>
          <th style={{ textAlign: "start", padding: "10px", fontSize: "14px" }}>
            Name
            <select
              name="sortByName"
              value={sortByName}
              onChange={handleSort}
              style={{
                fontSize: "12px",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              <option value="">Sort By Name</option>
              <option value="name">Ascending</option>
              <option value="nameDesc">Descending</option>
            </select>
          </th>
          <th style={{ textAlign: "start", padding: "10px", fontSize: "14px" }}>
            Email
            <select
              name="sortByEmail"
              value={sortByEmail}
              onChange={handleSort}
              style={{
                fontSize: "12px",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              <option value="">Sort By Email</option>
              <option value="email">Ascending</option>
              <option value="emailDesc">Descending</option>
            </select>
          </th>

          <th style={{ textAlign: "start", padding: "10px", fontSize: "14px" }}>
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {!loading ? (
          sortedUsers.map((user, index) => (
            <tr
              key={index}
              style={{
                marginBottom: "30px",
                borderBottom: "1px solid lightgray",
              }}
            >
              <td style={{ padding: "10px", fontSize: "11px" }}>
                {editIndex === index ? (
                  <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleChange}
                    style={{ fontSize: "11px", padding: "7px" }}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td style={{ padding: "10px", fontSize: "11px" }}>
                {editIndex === index ? (
                  <input
                    type="text"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    style={{ fontSize: "11px", padding: "7px" }}
                  />
                ) : (
                  user.email
                )}
              </td>

              <td style={{ display: "flex", gap: "10px", padding: "10px" }}>
                {editIndex === index ? (
                  <>
                    <button
                      onClick={handleSave}
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        width: "30%",
                        border: "none",
                        borderRadius: "5px",
                        padding: "4px 2px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      style={{
                        backgroundColor: "gray",
                        color: "white",
                        width: "30%",
                        border: "none",
                        borderRadius: "5px",
                        padding: "4px 2px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <Flex style={{ alignItems: "center", gap: "20px" }}>
                      <FaEdit
                        onClick={() => handleEdit(index)}
                        color="green"
                        style={{ cursor: "pointer" }}
                      />

                      <MdDelete color="red" style={{ cursor: "pointer" }} />
                      <Button
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          width: "35%",
                          border: "none",
                          borderRadius: "5px",
                          padding: "0px",
                          cursor: "pointer",
                          fontSize: "11px",
                        }}
                      >
                        Block
                      </Button>
                    </Flex>
                  </>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                }}
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Box>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default UserTable;
