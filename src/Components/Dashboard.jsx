import React from "react";
import {
  FaTachometerAlt,
  FaEnvelope,
  FaUsers,
  FaChartBar,
  FaCreditCard,
  FaComments,
} from "react-icons/fa"; // Import appropriate icons
import { IoIosArrowForward } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineContactSupport } from "react-icons/md";

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";

const userRouteCard = [
  {
    path: "/dashboard/users",
    icons: FaTachometerAlt, // Dashboard icon
    text: "Dashboard",
  },
  {
    path: "/dashboard/messages",
    icons: FaEnvelope, // Messages icon
    text: "Messages",
  },
  {
    path: "/dashboard/member",
    icons: FaUsers, // Member icon
    text: "Member",
  },
  {
    path: "/dashboard/course",
    icons: FaChartBar, // Analytics icon
    text: "Course",
  },
  {
    path: "/dashboard/courseOrder",
    icons: FaCreditCard, // Payment icon
    text: "Course Order",
  },
  {
    path: "/dashboard/chatPayment",
    icons: FaComments, // Payment icon
    text: "Chat Payment",
  },
  {
    path: "/dashboard/notification",
    icons: IoIosNotifications, // Payment icon
    text: "Notification",
  },
  {
    path: "/dashboard/contact",
    icons: MdOutlineContactSupport, // Payment icon
    text: "Contact Support",
  },
];

function Dashboard() {
  const location = useLocation();

  const getLinkColor = (path) => {
    return location.pathname === path ? "white" : "gray.600";
  };

  const getBgColor = (path) => {
    return location.pathname === path ? "#03A9F4" : "white";
  };

  const getIconColor = (path) => {
    return location.pathname === path ? "white" : "gray";
  };

  return (
    <>
      <Box
        w={"18%"}
        borderRight={"1px solid #BDBDBD"}
        height={"800px"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box
          width={"100%"}
          style={{
            borderRadius: "10px",
          }}
        >
          <Box width={"100%"} bg={"white"} borderTopRadius={"15px"} mt={"15px"}>
            <Image
              src="https://instalingual-app-new.s3.amazonaws.com/images/0ef3aa87-b54a-4c47-860a-dc1c4f2f7aac-Image.jpg"
              width={"80%"}
            />

            <Box w={"90%"} mt={"30px"} cursor={"pointer"}>
              {userRouteCard?.map((item, index) => (
                <NavLink to={item.path} key={index}>
                  <Box
                    // borderBottom={"1px solid #EEEEEE"}
                    // padding={"5px 0px 5px 0px"}
                    bg={getBgColor(item.path)}
                    borderRadius={"5px"}
                    mt={"10px"}
                  >
                    <Flex
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Box>
                        <Flex alignItems={"center"}>
                          <Box
                            // border={"1px solid #E0E0E0"}
                            p={"10px"}
                            fontSize={"16px"}
                            borderRadius={"50%"}
                            bg={getBgColor(item.path)}
                          >
                            <item.icons color={getIconColor(item.path)} />
                          </Box>

                          <Text
                            ml={"10px"}
                            fontWeight={"600"}
                            fontSize={"12px"}
                            color={getLinkColor(item.path)}
                          >
                            {item.text}
                          </Text>
                        </Flex>
                      </Box>
                      <Box>
                        {/* <IoIosArrowForward color={getIconColor(item.path)} /> */}
                      </Box>
                    </Flex>
                  </Box>
                </NavLink>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Profile Section */}
        <Box
          w={"100%"}
          // p={"20px"}
          paddingBottom={"10px"}

          // borderTop={"1px solid #BDBDBD"}
        >
          <Flex alignItems={"center"}>
            <Image
              src="/favicon.ico" // Path to the favicon in the public folder
              width={"35px"} // Adjust the size as needed
              height={"35px"}
              borderRadius={"50%"} // For a circular shape
              objectFit={"cover"}
              alt={"Favicon Image"}
            />
            <Box ml={"10px"}>
              <Text fontWeight={"600"} color={"gray.700"}>
                {localStorage.getItem("email")}
              </Text>
              {/* <Flex alignItems={"center"}>
                <CiLocationOn color={"gray.500"} />
                <Text fontSize={"12px"} color={"gray.500"} ml={"5px"}>
                  New York, USA
                </Text>
              </Flex> */}
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
