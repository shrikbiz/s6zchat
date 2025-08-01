import { Settings } from "@mui/icons-material";
import { Box, Modal, Typography } from "@mui/material";
import "./SearchModal.css";

export default function SearchModal({ isSettingsOpen, setIsSettingsOpen }) {
    return (
        <Modal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
            <Box className="settings-modal-container">
                <Box className="settings-modal-header">
                    <Settings sx={{ color: "#e5e5e5", mr: 1 }} />
                    <Typography
                        variant="h6"
                        className="settings-modal-title"
                    >
                        Settings
                    </Typography>
                </Box>
                {/* Settings content will go here */}
            </Box>
        </Modal>
    );
}
