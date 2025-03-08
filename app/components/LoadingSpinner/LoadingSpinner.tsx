import React from 'react';
import { RotatingLines } from "react-loader-spinner";

export default function LoadingSpinner() {
  return (
    <RotatingLines
      visible={true}
      animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
      strokeColor="#0000FF"
    />
  );
}
