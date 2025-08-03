import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import GradientText from "@components/Animations/GradientText";
import Threads from "@components/Animations/Threads";
import config from "@components/config";
import "./index.css";

const WelcomeScreen = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="welcome-loading-container">
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: "#40ffaa",
                    }}
                />
            </div>
        );
    }

    return (
        <div className="welcome-main-container">
            <div className="welcome-background-container">
                <Threads
                    amplitude={0.2}
                    distance={0.1}
                    enableMouseInteraction={true}
                />
            </div>
            <div className="welcome-content-container">
                <GradientText
                    colors={[
                        "#40ffaa",
                        "#40ffaa",
                        "#4079ff",
                        "#40ffaa",
                        "#4079ff",
                    ]}
                    animationSpeed={20}
                    showBorder={false}
                    className="custom-class"
                >
                    <h1>Welcome to {config.app.name}</h1>
                </GradientText>
            </div>
        </div>
    );
};

export default React.memo(WelcomeScreen);
