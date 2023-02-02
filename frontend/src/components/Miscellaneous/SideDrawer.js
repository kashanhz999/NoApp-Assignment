import {
  Button,
  Tooltip,
  Box,
  Text,
  Menu,
  MenuButton,
  Flex,
  MenuList,
  Avatar,
  WrapItem,
  Wrap,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import { Effect } from "react-notification-badge";

import UserListItem from "../UsersAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the seach results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        d={"flex"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"6.5px"}
      >
        <Flex
          minWidth="max-content"
          alignItems="stretch"
          gap="2"
          justifyContent="space-between"
        >
          <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
              <i class="fa fa-search"></i>
              <Text d={{ base: "none", md: "flex" }} px={"4"}>
                Search User
              </Text>
            </Button>
          </Tooltip>

          <Text fontSize="3xl" fontFamily={"Poppins"}>
            Talk
          </Text>

          <Wrap>
            <WrapItem>
              <Menu>
                <MenuButton p={1}>
                  <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}
                  />
                  <BellIcon boxSize={6} />
                  {/* <MenuList/> */}
                </MenuButton>
                <MenuList>
                  <Flex justifyContent={"center"}>
                    <Text fontFamily={"poppins"} fontSize="17">
                      {!notification.length && "No New Message"}
                      {notification.map((notifi) => (
                        <MenuItem
                          key={notifi._id}
                          onClick={() => {
                            setSelectedChat(notifi.chat);
                            setNotification(
                              notification.filter((n) => n !== notifi)
                            );
                          }}
                        >
                          {notifi.chat.isGroupChat
                            ? `New Message in ${notifi.chat.chatName}`
                            : `New Message from ${getSender(
                                user,
                                notifi.chat.users
                              )}`}
                        </MenuItem>
                      ))}
                    </Text>
                  </Flex>
                </MenuList>
              </Menu>
            </WrapItem>

            <WrapItem>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    name={user.name}
                    src={user.pic}
                  />
                </MenuButton>
                <MenuList>
                  <ProfileModal user={user}>
                    <MenuItem>Profile</MenuItem>
                  </ProfileModal>
                  <MenuDivider />
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </WrapItem>
          </Wrap>
        </Flex>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box pb={2}>
              <Flex justifyContent={"space-between"}>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Flex>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
