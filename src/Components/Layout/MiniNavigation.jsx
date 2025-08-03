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
            className="mini-navigation-drawer"
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
                    <Box className="mini-navigation-icon-container">
                        <Box
                            className="mini-navigation-icon-box"
                            sx={{
                                opacity: isMiniNavButtonFocused ? 0 : 1,
                                transform: isMiniNavButtonFocused
                                    ? "scale(0.95)"
                                    : "scale(1)",
                            }}
                        >
                            <CompanyIcon style={{ width: 24, height: 24 }} />
                        </Box>
                        <Box
                            className="mini-navigation-icon-box"
                            sx={{
                                opacity: isMiniNavButtonFocused ? 1 : 0,
                                transform: isMiniNavButtonFocused
                                    ? "scale(1)"
                                    : "scale(0.95)",
                            }}
                        >
                            <ViewSidebarRounded sx={{ fontSize: 24 }} />
                        </Box>
                    </Box>
                </StyledIconButton>
            </Tooltip>
            <Divider className="mini-navigation-divider" />
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
