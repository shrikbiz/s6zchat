import React, { useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    Settings as SettingsIcon,
    ViewSidebarRounded,
    AddComment,
    MoreVert,
} from "@mui/icons-material";
import CompanyIcon from "../CompanyIcon";
import chatDB from "../ChatDB";
import {
    MainContent,
    StyledDrawer,
    StyledIconButton,
    StyledListItemButton,
    StyledMiniDrawer,
} from "./CustomeComponents";

/**
 * Layout component for the main application structure.
 * Provides a sidebar with navigation, chat history, and a footer.
 * The sidebar can be toggled open/closed, and includes a mini navigation always visible.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Main content to render next to the sidebar.
 */
export default function Layout({
    setOffset,
    children,
    chatListSection,
    limit,
    loadingMore,
    setLoadingMore,
    chatList,
    setChatList,
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // State to track if the mini nav button is hovered or focused
    const [isMiniNavButtonFocused, setIsMiniNavButtonFocused] = useState(false);
    // Add chatSessionKey state for remounting S6ZChat
    const [chatSessionKey, setChatSessionKey] = useState(() => Date.now());

    // Infinite scroll handler
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (
            scrollHeight - scrollTop - clientHeight < 50 &&
            chatListSection &&
            chatListSection.length === limit &&
            !loadingMore
        ) {
            setLoadingMore(true);
            setOffset((prev) => prev + limit);
        }
    };

    // Main navigation items (top of sidebar)
    const mainNavigationItems = [
        {
            icon: <AddComment />,
            text: "New Chat",
            action: () => {
                const path = window.location.pathname.replace(
                    /\/chat(\/[^/]*)?$/,
                    ""
                );
                window.history.replaceState({}, "", `${path}${"/chat"}`);

                setChatSessionKey(Date.now());
            },
        },
    ];

    // Toggle sidebar drawer open/close
    const handleDrawerToggle = () => setIsDrawerOpen(!isDrawerOpen);

    // Main layout rendering
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/* Mini Navigation (always visible) */}
            <MiniNavigation
                mainNavigationItems={mainNavigationItems}
                handleDrawerToggle={handleDrawerToggle}
                isMiniNavButtonFocused={isMiniNavButtonFocused}
                setIsMiniNavButtonFocused={setIsMiniNavButtonFocused}
            />

            {/* Full Side Navigation (Drawer) */}
            <StyledDrawer
                variant="persistent"
                open={isDrawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: "block" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: 260,
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        position: "relative",
                    }}
                >
                    <SideBarHeader handleDrawerToggle={handleDrawerToggle} />

                    <Divider
                        sx={{
                            backgroundColor: "#4a4b53",
                            margin: "0 8px 8px 8px",
                        }}
                    />

                    <SideBarOptions
                        chatList={chatList}
                        handleScroll={handleScroll}
                        setChatSessionKey={setChatSessionKey}
                        mainNavigationItems={mainNavigationItems}
                        setChatList={setChatList}
                    />

                    <Divider
                        sx={{
                            backgroundColor: "#4a4b53",
                            margin: "0 8px 8px 8px",
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 56, // height of the footer Box (adjust if needed)
                            zIndex: 1,
                        }}
                    />

                    <SideBarFooter />
                </Box>
            </StyledDrawer>

            {/* Main Content Area */}
            <MainContent>
                {React.cloneElement(children, { key: chatSessionKey })}
            </MainContent>
        </Box>
    );
}

/* Mini Navigation (always visible) */
function MiniNavigation({
    mainNavigationItems,
    handleDrawerToggle,
    isMiniNavButtonFocused,
    setIsMiniNavButtonFocused,
}) {
    return (
        <StyledMiniDrawer
            onClick={handleDrawerToggle}
            sx={{ cursor: "pointer" }}
        >
            <Tooltip title="Open Navigation" placement="right">
                <StyledIconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDrawerToggle();
                    }}
                    onMouseEnter={() => setIsMiniNavButtonFocused(true)}
                    onMouseLeave={() => setIsMiniNavButtonFocused(false)}
                    onFocus={() => setIsMiniNavButtonFocused(true)}
                    onBlur={() => setIsMiniNavButtonFocused(false)}
                >
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: isMiniNavButtonFocused ? 0 : 1,
                                transform: isMiniNavButtonFocused
                                    ? "scale(0.95)"
                                    : "scale(1)",
                                transition: "opacity 0.4s, transform 0.4s",
                            }}
                        >
                            <CompanyIcon style={{ width: 24, height: 24 }} />
                        </Box>
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: isMiniNavButtonFocused ? 1 : 0,
                                transform: isMiniNavButtonFocused
                                    ? "scale(1)"
                                    : "scale(0.95)",
                                transition: "opacity 0.4s, transform 0.4s",
                            }}
                        >
                            <ViewSidebarRounded sx={{ fontSize: 24 }} />
                        </Box>
                    </Box>
                </StyledIconButton>
            </Tooltip>
            <Divider
                sx={{
                    width: "80%",
                    backgroundColor: "#4a4b53",
                    margin: "8px 0",
                }}
            />
            {mainNavigationItems.map((item, index) => (
                <Tooltip key={index} title={item.text} placement="right">
                    <StyledIconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            item.action();
                        }}
                    >
                        {item.icon}
                    </StyledIconButton>
                </Tooltip>
            ))}
            {/* No footer items in mini navigation */}
        </StyledMiniDrawer>
    );
}

/* Header: Company icon and close button */
function SideBarHeader({ handleDrawerToggle }) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 1,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "end",
                    height: "100%",
                    paddingBottom: "5px",
                }}
            >
                <CompanyIcon />
            </Box>
            <Box>
                <Tooltip title="Close Navigation" placement="bottom">
                    <StyledIconButton onClick={handleDrawerToggle}>
                        <ViewSidebarRounded />
                    </StyledIconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}

/* Footer section for sidebar (always at bottom) */
function SideBarFooter() {
    // Footer navigation items (bottom of sidebar)
    const footerNavigationItems = [
        {
            icon: <SettingsIcon />,
            text: "Settings",
            action: () => {},
        },
    ];
    return (
        <Box
            id="sideNavFooter"
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                padding: 1,
                display: "flex",
                justifyContent: "flex-start",
                gap: 1,
                background: "#202123",
            }}
        >
            {footerNavigationItems.map((item, index) => (
                <Tooltip key={index} title={item.text} placement="top">
                    <StyledIconButton onClick={item.action}>
                        {item.icon}
                    </StyledIconButton>
                </Tooltip>
            ))}
        </Box>
    );
}

/* Scrollable area: New chat, chat title, chat list */
function SideBarOptions({
    chatList,
    handleScroll,
    setChatSessionKey,
    mainNavigationItems,
    setChatList,
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);

    const handleMenuOpen = (event, chat) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedChat(chat);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedChat(null);
    };

    const handleDeleteChat = async () => {
        const chatId = selectedChat?.chatId;
        const chatName = selectedChat?.chatName;

        try {
            // Delete from database
            await chatDB.deleteChatByChatId(chatId);

            // Remove from chatList state
            setChatList((prevChatList) =>
                prevChatList.filter((chat) => chat.chatId !== chatId)
            );

            console.log(`Successfully deleted chat: ${chatName} (${chatId})`);
        } catch (error) {
            console.error("Error deleting chat:", error);
        }

        handleMenuClose();
    };

    return (
        <Box
            id="sideNavScrollArea"
            sx={{
                height: "calc(100% - 140px)",
                overflowY: "auto",
                position: "relative",
            }}
            onScroll={handleScroll}
        >
            {/* Main navigation (e.g., New Chat) */}
            <List sx={{ padding: 1 }}>
                {mainNavigationItems.map(({ icon, text, action }, idx) => (
                    <ListItem disablePadding key={idx}>
                        <StyledListItemButton disableRipple onClick={action}>
                            <ListItemIcon
                                sx={{ color: "#e5e5e5", minWidth: 30 }}
                            >
                                {icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={text}
                                sx={{
                                    "& .MuiListItemText-primary": {
                                        fontSize: "14px",
                                        fontWeight: 400,
                                    },
                                }}
                            />
                        </StyledListItemButton>
                    </ListItem>
                ))}
            </List>
            {/* Chat History Title (fixed within scroll area) */}
            <List sx={{ paddingBottom: 0 }}>
                <ListItem sx={{ paddingBottom: 0 }}>
                    <ListItemText
                        primary="Chats"
                        sx={{
                            "& .MuiListItemText-primary": {
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#b0b0b0",
                                paddingBottom: 0,
                            },
                        }}
                    />
                </ListItem>
            </List>
            {/* Chat History List (scrollable with title) */}
            <Box
                id="chatHistoryContainer"
                sx={{
                    padding: 0,
                    margin: 0,
                }}
            >
                <List sx={{ padding: 0, margin: 0 }}>
                    {chatList.map((chat) => (
                        <ListItem
                            id="chatHistoryItems"
                            key={chat.chatId}
                            disablePadding
                            sx={{
                                position: "relative",
                                "&:hover .chat-menu-button": {
                                    opacity: 1,
                                },
                            }}
                        >
                            <StyledListItemButton
                                disableRipple
                                onClick={() => {
                                    // INSERT_YOUR_CODE
                                    const path =
                                        window.location.pathname.replace(
                                            /\/chat(\/[^/]*)?$/,
                                            ""
                                        );
                                    window.history.replaceState(
                                        {},
                                        "",
                                        `${path}/chat/${chat.chatId}`
                                    );
                                    setChatSessionKey(Date.now());
                                }}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <ListItemText
                                    primary={chat.chatName}
                                    sx={{
                                        "& .MuiListItemText-primary": {
                                            fontSize: "13px",
                                            fontWeight: 400,
                                            color: "#e5e5e5",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            maxWidth: "180px", // Adjust based on your sidebar width
                                        },
                                    }}
                                    title={chat.chatName} // Shows full text on hover
                                />
                                <IconButton
                                    className="chat-menu-button"
                                    onClick={(event) =>
                                        handleMenuOpen(event, chat)
                                    }
                                    sx={{
                                        opacity: 0,
                                        transition: "opacity 0.2s",
                                        color: "#e5e5e5",
                                        padding: "4px",
                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(255, 255, 255, 0.08)",
                                        },
                                    }}
                                    size="small"
                                >
                                    <MoreVert fontSize="small" />
                                </IconButton>
                            </StyledListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Chat Options Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        backgroundColor: "#2d2d2d",
                        color: "#e5e5e5",
                        "& .MuiMenuItem-root": {
                            fontSize: "13px",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                            },
                        },
                    },
                }}
            >
                <MenuItem onClick={handleDeleteChat}>Delete chat</MenuItem>
            </Menu>
        </Box>
    );
}
