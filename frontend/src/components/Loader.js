import React from "react";
// React Bootstrap
import { Spinner } from "react-bootstrap";

function Loader({ height }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: `70vh`,
      }}>
      <Spinner
        animation='border'
        role='status'
        style={{
          height: "150px",
          width: "150px",
        }}>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loader;
