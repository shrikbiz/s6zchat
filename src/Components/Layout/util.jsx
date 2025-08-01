import { Box, Drawer, ListItemButton, IconButton, styled } from "@mui/material";

// =====================
// Styled Components
// =====================

/**
 * Styled Drawer for sidebar navigation
 */
export const StyledDrawer = styled(Drawer)(() => ({
    "& .MuiDrawer-paper": {
        width: 260,
        backgroundColor: "#202123",
        color: "#e5e5e5",
        border: "none",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.3)",
    },
}));

/**
 * Styled Box for mini navigation (collapsed sidebar)
 */
export const StyledMiniDrawer = styled(Box)(() => ({
    width: 60,
    backgroundColor: "#202123",
    color: "#e5e5e5",
    border: "none",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 8,
}));

/**
 * Styled ListItemButton for navigation/chat items
 */
export const StyledListItemButton = styled(ListItemButton)(() => ({
    border: "none",
    borderRadius: 10,
    minHeight: 32,
    "&:hover": {
        backgroundColor: "#2a2b32",
    },
    "&.MuiButtonBase-root": {
        minHeight: 32,
    },
}));

/**
 * Styled IconButton for navigation icons
 */
export const StyledIconButton = styled(IconButton)(() => ({
    color: "#e5e5e5",
    margin: "4px 0",
    "&:hover": {
        backgroundColor: "#2a2b32",
    },
}));

/**
 * Main content area next to the sidebar
 */
export const MainContent = styled(Box)(() => ({
    flexGrow: 1,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
}));
