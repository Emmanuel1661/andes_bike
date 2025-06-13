import React from "react";

export default function ARModelViewer({ url }) {
  return (
    <>
      <script
        type="module"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      ></script>
      <model-viewer
        src={url}
        alt="Modelo 3D de bicicleta"
        ar
        ar-modes="webxr scene-viewer quick-look"
        environment-image="neutral"
        auto-rotate
        camera-controls
        style={{ width: "100%", height: "500px" }}
      />
    </>
  );
}
