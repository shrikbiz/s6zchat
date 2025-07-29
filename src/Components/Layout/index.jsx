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
    Modal,
    TextField,
    List as MUIList,
    ListItem as MUIListItem,
    ListItemText as MUIListItemText,
    Box as MUIBox,
    Typography,
} from "@mui/material";
import {
    Settings as SettingsIcon,
    ViewSidebarRounded,
    AddComment,
    MoreVert,
    Search as SearchIcon,
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
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Extracted function to trigger a new chat (now only updates state)
    const triggerNewChat = () => {
        setChatSessionKey(Date.now());
    };

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

    // Add Search to mainNavigationItems
    const mainNavigationItems = [
        {
            icon: <AddComment />,
            text: "New chat",
            action: () => {
                const path = window.location.pathname.replace(
                    /\/chat(\/[^/]*)?$/,
                    ""
                );
                window.history.replaceState({}, "", `${path}${"/chat"}`);
                triggerNewChat();
            },
        },
        {
            icon: <SearchIcon />,
            text: "Search",
            action: () => setIsSearchOpen(true),
        },
    ];

    // Search logic
    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = await chatDB.searchChats(query);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectChat = (chatId) => {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        const path = window.location.pathname.replace(/\/chat(\/[^/]*)?$/, "");
        window.history.replaceState({}, "", `${path}/chat/${chatId}`);
        triggerNewChat();
    };

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
                        triggerNewChat={triggerNewChat}
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

                    <SideBarFooter setIsSettingsOpen={setIsSettingsOpen} />
                </Box>
            </StyledDrawer>

            {/* Main Content Area */}
            <MainContent>
                {React.cloneElement(children, { key: chatSessionKey })}
            </MainContent>

            {/* Search Modal */}
            <Modal open={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
                <MUIBox
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: {
                            xs: "90vw",
                            sm: "70vw",
                            md: "60vw",
                            lg: "50vw",
                        },
                        maxWidth: 600,
                        minWidth: 300,
                        height: { xs: "70vh", sm: "60vh", md: "60vh" },
                        bgcolor: "#23242a", // dark background
                        color: "#e5e5e5", // light text
                        boxShadow: 24,
                        p: 2,
                        borderRadius: 2,
                        outline: "none",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <SearchIcon sx={{ color: '#e5e5e5', mr: 1 }} />
                        <Typography
                            variant="h6"
                            sx={{ color: "#e5e5e5", fontWeight: 600 }}
                        >
                            Search chats
                        </Typography>
                    </Box>
                    <TextField
                        autoFocus
                        fullWidth
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{
                            mb: 2,
                            input: { color: "#e5e5e5", background: "#23242a" },
                            label: { color: "#b0b0b0" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#444654" },
                                "&:hover fieldset": { borderColor: "#40ffaa" },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#40ffaa",
                                },
                            },
                        }}
                        InputLabelProps={{ style: { color: "#b0b0b0" } }}
                    />
                    <MUIList
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            background: "transparent",
                            p: 0,
                            mb: 0,
                        }}
                    >
                        {searchQuery ? (
                            searchResults.length === 0 ? (
                                <MUIListItem>
                                    <MUIListItemText primary="No results found" />
                                </MUIListItem>
                            ) : (
                                searchResults.map((chat) => (
                                    <MUIListItem
                                        button
                                        key={chat.chatId}
                                        onClick={() =>
                                            handleSelectChat(chat.chatId)
                                        }
                                        sx={{
                                            background: "#23242a",
                                            "&:hover": {
                                                background: "#2a2b32",
                                            },
                                        }}
                                    >
                                        <MUIListItemText
                                            primary={
                                                chat.chatName || "Untitled Chat"
                                            }
                                            secondary={
                                                chat.chatItem &&
                                                chat.chatItem.length
                                                    ? chat.chatItem[0].content.slice(
                                                          0,
                                                          40
                                                      )
                                                    : ""
                                            }
                                            primaryTypographyProps={{
                                                color: "#e5e5e5",
                                                fontSize: 15,
                                                fontWeight: 500,
                                                sx: {
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                },
                                            }}
                                            secondaryTypographyProps={{
                                                color: "#b0b0b0",
                                                fontSize: 13,
                                                sx: {
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                },
                                            }}
                                        />
                                    </MUIListItem>
                                ))
                            )
                        ) : (
                            chatList.map((chat) => (
                                <MUIListItem
                                    button
                                    key={chat.chatId}
                                    onClick={() =>
                                        handleSelectChat(chat.chatId)
                                    }
                                    sx={{
                                        background: "#23242a",
                                        "&:hover": { background: "#2a2b32" },
                                    }}
                                >
                                    <MUIListItemText
                                        primary={
                                            chat.chatName || "Untitled Chat"
                                        }
                                        secondary={
                                            chat.chatItem &&
                                            chat.chatItem.length
                                                ? chat.chatItem[0].content.slice(
                                                      0,
                                                      40
                                                  )
                                                : ""
                                        }
                                        primaryTypographyProps={{
                                            color: "#e5e5e5",
                                            fontSize: 15,
                                            fontWeight: 500,
                                            sx: {
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            },
                                        }}
                                        secondaryTypographyProps={{
                                            color: "#b0b0b0",
                                            fontSize: 13,
                                            sx: {
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            },
                                        }}
                                    />
                                </MUIListItem>
                            ))
                        )}
                    </MUIList>
                </MUIBox>
            </Modal>

            {/* Settings Modal */}
            <Modal
                open={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            >
                <MUIBox
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: {
                            xs: "90vw",
                            sm: "70vw",
                            md: "60vw",
                            lg: "50vw",
                        },
                        maxWidth: 600,
                        minWidth: 300,
                        height: { xs: "70vh", sm: "60vh", md: "60vh" },
                        bgcolor: "#23242a",
                        color: "#e5e5e5",
                        boxShadow: 24,
                        p: 3,
                        borderRadius: 2,
                        outline: "none",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <SettingsIcon sx={{ color: "#e5e5e5", mr: 1 }} />
                        <Typography
                            variant="h6"
                            sx={{ color: "#e5e5e5", fontWeight: 600 }}
                        >
                            Settings
                        </Typography>
                    </Box>
                    {/* Settings content will go here */}
                </MUIBox>
            </Modal>
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
function SideBarFooter({ setIsSettingsOpen }) {
    // Footer navigation items (bottom of sidebar)
    const footerNavigationItems = [
        {
            icon: <SettingsIcon />,
            text: "Settings",
            action: () => setIsSettingsOpen(true),
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
    triggerNewChat,
    mainNavigationItems,
    setChatList,
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatsTitleAnchorEl, setChatsTitleAnchorEl] = useState(null);

    const handleMenuOpen = (event, chat) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedChat(chat);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedChat(null);
    };

    const handleChatsTitleMenuOpen = (event) => {
        event.stopPropagation();
        setChatsTitleAnchorEl(event.currentTarget);
    };

    const handleChatsTitleMenuClose = () => {
        setChatsTitleAnchorEl(null);
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

            // Get current chatId from URL
            const match = window.location.pathname.match(/\/chat\/(.+)$/);
            const currentChatId = match ? match[1] : null;
            if (currentChatId === chatId) {
                // If the deleted chat is the current one, update URL and trigger new chat
                const path = window.location.pathname.replace(
                    /\/chat(\/[^/]*)?$/,
                    ""
                );
                window.history.replaceState({}, "", `${path}${"/chat"}`);
                triggerNewChat();
            }

            console.log(`Successfully deleted chat: ${chatName} (${chatId})`);
        } catch (error) {
            console.error("Error deleting chat:", error);
        }

        handleMenuClose();
    };

    const handleDeleteAllChats = async () => {
        try {
            // Delete all chats from database
            await chatDB.deleteAllChats();

            // Clear chatList state
            setChatList([]);

            console.log("Successfully deleted all chats");
            // Update URL and trigger new chat after deleting all
            const path = window.location.pathname.replace(
                /\/chat(\/[^/]*)?$/,
                ""
            );
            window.history.replaceState({}, "", `${path}${"/chat"}`);
            triggerNewChat();
        } catch (error) {
            console.error("Error deleting all chats:", error);
        }

        handleChatsTitleMenuClose();
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
                <ListItem
                    sx={{
                        paddingBottom: 0,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        "&:hover .chats-title-menu-button": {
                            opacity: 1,
                        },
                    }}
                >
                    <ListItemText
                        primary="Chats"
                        sx={{
                            "& .MuiListItemText-primary": {
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#b0b0b0",
                                paddingBottom: 0,
                            },
                        }}
                    />
                    <IconButton
                        className="chats-title-menu-button"
                        onClick={handleChatsTitleMenuOpen}
                        sx={{
                            opacity: 0,
                            transition: "opacity 0.2s",
                            color: "#b0b0b0",
                            padding: "4px",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                            },
                        }}
                        size="small"
                    >
                        <MoreVert fontSize="small" />
                    </IconButton>
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
                                    console.log("chat.chatId", chat.chatId);
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
                                    triggerNewChat();
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

            {/* Chats Title Options Menu */}
            <Menu
                anchorEl={chatsTitleAnchorEl}
                open={Boolean(chatsTitleAnchorEl)}
                onClose={handleChatsTitleMenuClose}
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
                <MenuItem onClick={handleDeleteAllChats}>
                    Delete all chats
                </MenuItem>
            </Menu>
        </Box>
    );
}
