import React from "react";

export default function CompanyIcon({ size }) {
    return (
        <img
            src={require("./s6z.png")}
            alt="Company Icon"
            style={{
                width: size ?? "2.5rem",
                height: size ?? "2.5rem",
                objectFit: "contain",
                filter: "invert(1)",
            }}
        />
    );
}
