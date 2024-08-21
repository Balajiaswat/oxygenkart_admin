import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { useLocation } from "react-router-dom";
import User from "./User";
import Dashboard from "../Components/Dashboard";
import Message from "./Message";
import Member from "./Member";
import Course from "./Course";
import Notification from "./Notification";
import CourserOrder from "./CourserOrder";
import ContactUs from "./ContactUs";

function Account() {
  const location = useLocation();

  // Set the default route to "/account/orders"
  const defaultRoute = "/dashboard/user";

  // If the current route is the default, update it based on the selected left-side route
  const updatedRoute =
    location.pathname.startsWith("/dashboard") &&
    location.pathname !== "/dashboard"
      ? location.pathname
      : defaultRoute;

  // Render different components based on the route
  const renderUI = () => {
    switch (updatedRoute) {
      case "/dashboard/user":
        return <User />;
      case "/dashboard/messages":
        return <Message />;
      case "/dashboard/member":
        return <Member />;
      case "/dashboard/course":
        return <Course />;
      case "/dashboard/notification":
        return <Notification />;
      case "/dashboard/courseOrder":
        return <CourserOrder />;
      case "/dashboard/contact":
        return <ContactUs />;
      default:
        return <User />;
    }
  };

  return (
    <>
      <Box>
        <Box bg={"white"}>
          <Box width={"95%"} m={"auto"}>
            <Flex
              alignItems={"start"}
              justifyContent={"space-between"}
              gap={"40px"}
            >
              <Dashboard />

              {/* i wantt to render ui of other routee */}
              {renderUI()}
            </Flex>
            <Box />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Account;
