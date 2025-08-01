import CompanyIcon from "@components/CompanyIcon";
import { Box, Tooltip } from "@mui/material";
import { StyledIconButton } from "./util";
import { ViewSidebarRounded } from "@mui/icons-material";

/* Header: Company icon and close button */
export default function SideBarHeader({ handleDrawerToggle }) {
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
