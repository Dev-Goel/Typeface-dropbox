import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const allowedTypes = [
    "text/plain",
    "application/json",
    "image/png",
    "image/jpeg",
    "application/pdf"
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Unsupported file type");
      setFile(null);
    } else {
      setError("");
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/upload", formData);
      navigate("/"); // go back to home
    } catch (err) {
      setError("Upload failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={!file} style={{ marginLeft: "8px" }}>
          Upload
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
