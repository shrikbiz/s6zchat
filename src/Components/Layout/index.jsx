import React, { useState } from "react";
import { Box, Divider } from "@mui/material";
import { AddComment, Search as SearchIcon } from "@mui/icons-material";
import chatDB from "../ChatDB";
import { MainContent, StyledDrawer } from "./util";
import SideBarFooter from "./SideBarFooter";
import SideBarOptions from "./SideBarOptions";
import MiniNavigation from "./MiniNavigation";
import SideBarHeader from "./SideBarHeader";
import ChatSearchModal from "./SearchModal";
import SearchModal from "./SearchModel";

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
                <Box className="layout-sidebar-container">
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
            <ChatSearchModal
                searchQuery={searchQuery}
                isSearchOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
                handleSearch={handleSearch}
                searchResults={searchResults}
                handleSelectChat={handleSelectChat}
                chatList={chatList}
            />

            {/* Settings Modal */}
            <SearchModal
                isSettingsOpen={isSettingsOpen}
                setIsSettingsOpen={setIsSettingsOpen}
            />
        </Box>
    );
}
