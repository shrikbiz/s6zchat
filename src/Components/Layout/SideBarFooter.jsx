import { Settings as SettingsIcon } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { StyledIconButton } from "./util";

/* Footer section for sidebar (always at bottom) */
export default function SideBarFooter({ setIsSettingsOpen }) {
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
