import React, { useState } from "react";
import {
    FormControl,
    Select,
    MenuItem,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import { MODELS } from "@components/API/config";
import "./index.css";

const modelInfo = {
    [MODELS.openAI]: {
        description: "GPT-4.1 - Cloud-based, powerful AI model",
        chipColor: "primary",
        chipText: "Cloud",
    },
    [MODELS.ollama]: {
        description: "Gemma3 - Local, privacy-focused AI model",
        chipColor: "secondary",
        chipText: "Local",
    },
};

const ModelSelector = ({ selectedModel, onModelChange }) => {
    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        onModelChange(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <Box className="model-selector-container">
            <FormControl fullWidth size="small">
                <Select
                    value={selectedModel}
                    onChange={handleChange}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    open={open}
                    className="model-selector-select"
                    sx={{
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            className: "model-selector-menu",
                        },
                    }}
                >
                    {Object.values(MODELS).map((model) => (
                        <MenuItem
                            key={model}
                            value={model}
                            className="model-selector-menu-item"
                            sx={{
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                                "&.Mui-selected": {
                                    backgroundColor:
                                        "rgba(255, 255, 255, 0.15)",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.2)",
                                    },
                                },
                            }}
                        >
                            <Box className="model-selector-menu-item-container">
                                <Box className="model-selector-menu-item-header">
                                    <Typography
                                        variant="body2"
                                        className="model-selector-menu-item-title"
                                    >
                                        {model}
                                    </Typography>
                                    <Chip
                                        label={modelInfo[model].chipText}
                                        size="small"
                                        color={modelInfo[model].chipColor}
                                        className="model-selector-chip"
                                    />
                                </Box>
                                <Typography
                                    variant="caption"
                                    className="model-selector-description"
                                >
                                    {modelInfo[model].description}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default ModelSelector;
