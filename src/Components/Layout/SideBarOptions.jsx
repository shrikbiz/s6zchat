import chatDB from "@components/ChatDB";
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import { useState } from "react";
import { StyledListItemButton } from "./util";
import { MoreVert } from "@mui/icons-material";

/* Scrollable area: New chat, chat title, chat list */
export default function SideBarOptions({
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
            data-testid="sidebar-options"
            sx={{
                height: "calc(100% - 140px)",
                overflowY: "auto",
                position: "relative",
            }}
            onScroll={handleScroll}
        >
            {/* Main navigation (e.g., New Chat) */}
            <List sx={{ padding: 1 }} data-testid="sidebar-main-navigation">
                {mainNavigationItems.map(({ icon, text, action }, idx) => (
                    <ListItem disablePadding key={idx}>
                        <StyledListItemButton 
                            data-testid={`sidebar-${text.toLowerCase().replace(' ', '-')}`}
                            disableRipple 
                            onClick={action}>
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
            <List sx={{ paddingBottom: 0 }} data-testid="chats-section">
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
                        data-testid="chats-title"
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
                data-testid="chat-history-container"
                sx={{
                    padding: 0,
                    margin: 0,
                }}
            >
                <List sx={{ padding: 0, margin: 0 }} data-testid="chat-history-list">
                    {chatList.map((chat) => (
                        <ListItem
                            id="chatHistoryItems"
                            data-testid="chat-item"
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
