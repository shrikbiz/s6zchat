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
        <Box id="sideNavFooter" className="sidebar-footer" data-testid="sidebar-footer">
            {footerNavigationItems.map((item, index) => (
                <Tooltip key={index} title={item.text} placement="top">
                    <StyledIconButton 
                        data-testid={item.text.toLowerCase()}
                        onClick={item.action}>
                        {item.icon}
                    </StyledIconButton>
                </Tooltip>
            ))}
        </Box>
    );
}
