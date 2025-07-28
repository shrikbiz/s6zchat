import React, { useState } from 'react';
import {
    FormControl,
    Select,
    MenuItem,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import { MODELS } from '@components/API/config';

const modelInfo = {
    [MODELS.openAI]: {
        description: "GPT-4.1 - Cloud-based, powerful AI model",
        chipColor: "primary",
        chipText: "Cloud"
    },
    [MODELS.ollama]: {
        description: "Gemma3 - Local, privacy-focused AI model",
        chipColor: "secondary",
        chipText: "Local"
    }
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
        <Box
            sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1000,
                minWidth: 200,
            }}
        >
            <FormControl fullWidth size="small">
                <Select
                    value={selectedModel}
                    onChange={handleChange}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    open={open}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        '& .MuiSelect-select': {
                            color: '#e5e5e5',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backgroundColor: '#2d2d2d',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 2,
                                mt: 1,
                            }
                        }
                    }}
                >
                    {Object.values(MODELS).map((model) => (
                        <MenuItem
                            key={model}
                            value={model}
                            sx={{
                                color: '#e5e5e5',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {model}
                                    </Typography>
                                    <Chip
                                        label={modelInfo[model].chipText}
                                        size="small"
                                        color={modelInfo[model].chipColor}
                                        sx={{
                                            height: 20,
                                            fontSize: '0.7rem',
                                            fontWeight: 500,
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.75rem',
                                        lineHeight: 1.2,
                                    }}
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