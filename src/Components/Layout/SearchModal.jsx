import { Search } from "@mui/icons-material";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Modal,
    TextField,
    Typography,
} from "@mui/material";

export default function ChatSearchModal({
    searchQuery,
    isSearchOpen,
    setIsSearchOpen,
    handleSearch,
    searchResults,
    handleSelectChat,
    chatList,
}) {
    return (
        <Modal open={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
            <Box
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
                <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <Search sx={{ color: "#e5e5e5", mr: 1 }} />
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
                <List
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
                            <ListItem>
                                <ListItemText primary="No results found" />
                            </ListItem>
                        ) : (
                            searchResults.map((chat) => (
                                <ListItem
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
                                    <ListItemText
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
                                </ListItem>
                            ))
                        )
                    ) : (
                        chatList.map((chat) => (
                            <ListItem
                                button
                                key={chat.chatId}
                                onClick={() => handleSelectChat(chat.chatId)}
                                sx={{
                                    background: "#23242a",
                                    "&:hover": { background: "#2a2b32" },
                                }}
                            >
                                <ListItemText
                                    primary={chat.chatName || "Untitled Chat"}
                                    secondary={
                                        chat.chatItem && chat.chatItem.length
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
                            </ListItem>
                        ))
                    )}
                </List>
            </Box>
        </Modal>
    );
}
