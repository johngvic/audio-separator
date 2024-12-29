import React from "react";
import { LinearProgress } from "@mui/material";

const ProgressBar = ({ currentTime, duration }) => {
  const progress = (currentTime / duration) * 100;

  return (
    <div>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "#eee",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#4caf50",
          },
        }}
      />
    </div>
  );
};

export default ProgressBar;
