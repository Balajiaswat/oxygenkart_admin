import React, { useState } from "react";

function Pagination({ usersPerPage, totalUsers, paginate }) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    paginate(pageNumber);
  };

  return (
    <nav>
      <ul
        style={{
          width: "70%",
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        {pageNumbers.map((number) => (
          <li key={number} style={{ listStyle: "none" }}>
            <button
              onClick={() => handleClick(number)}
              style={{
                width: "37px",
                padding: "6px",
                backgroundColor: currentPage === number ? "gray" : "white",
                marginRight: "8px",
                borderRadius: "50%",
                color: currentPage === number ? "white" : "black",
                border: "1px solid gray",
                cursor: "pointer",
              }}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;
