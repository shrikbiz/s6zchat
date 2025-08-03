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
            <Box className="search-modal-container">
                <Box className="search-modal-header">
                    <Search sx={{ color: "#e5e5e5", mr: 1 }} />
                    <Typography variant="h6" className="search-modal-title">
                        Search chats
                    </Typography>
                </Box>
                <TextField
                    autoFocus
                    fullWidth
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-modal-textfield"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#40ffaa" },
                            "&.Mui-focused fieldset": {
                                borderColor: "#40ffaa",
                            },
                        },
                    }}
                    InputLabelProps={{ style: { color: "#b0b0b0" } }}
                />
                <List className="search-modal-list">
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
                                    className="search-modal-list-item"
                                    sx={{
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
                                            className: "search-modal-list-item-text-primary",
                                        }}
                                        secondaryTypographyProps={{
                                            className: "search-modal-list-item-text-secondary",
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
                                className="search-modal-list-item"
                                sx={{
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
                                        className: "search-modal-list-item-text-primary",
                                    }}
                                    secondaryTypographyProps={{
                                        className: "search-modal-list-item-text-secondary",
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
