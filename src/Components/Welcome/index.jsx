import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import GradientText from "@components/Animations/GradientText";
import Threads from "@components/Animations/Threads";
import config from "@components/config";

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
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
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
        <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                }}
            >
                <Threads
                    amplitude={0.2}
                    distance={0.1}
                    enableMouseInteraction={true}
                />
            </div>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none", // so background is interactive if needed
                }}
            >
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
