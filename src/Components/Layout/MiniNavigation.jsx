import { Box, Divider, Tooltip } from "@mui/material";
import { StyledIconButton, StyledMiniDrawer } from "./util";
import CompanyIcon from "@components/CompanyIcon";
import { ViewSidebarRounded } from "@mui/icons-material";

/* Mini Navigation (always visible) */
export default function MiniNavigation({
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
