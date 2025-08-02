import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function FileViewer() {
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        API.get("/files")
            .then((res) => {
                const found = res.data.find((f) => f.id === parseInt(id));
                if (!found) {
                    setError("File not found");
                    return;
                }

                setFile(found);

                // If it's text or json, fetch content
                if (["text/plain", "application/json"].includes(found.mimetype)) {
                    fetch(`http://localhost:4000/uploads/${found.filename}`)
                        .then((res) => res.text())
                        .then(setContent)
                        .catch(() => setError("Failed to load file content"));
                }
            })
            .catch(() => setError("Could not fetch file metadata"));
    }, [id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!file) return <p>Loading...</p>;

    return (
        <div>
            <h2>{file.originalname}</h2>
            <p>Type: {file.mimetype}</p>

            {file.mimetype.startsWith("image/") && (
                <img
                    src={`http://localhost:4000/uploads/${file.filename}`}
                    alt={file.originalname}
                    style={{ maxWidth: "100%", border: "1px solid #ccc", marginTop: "1rem" }}
                />
            )}
            {file.mimetype === "application/pdf" && (
                <iframe
                    src={`http://localhost:4000/uploads/${file.filename}`}
                    title={file.originalname}
                    width="100%"
                    height="600px"
                    style={{ border: "1px solid #ccc", marginTop: "1rem" }}
                />
            )}
            {["text/plain", "application/json"].includes(file.mimetype) && (
                <pre
                    style={{
                        whiteSpace: "pre-wrap",
                        background: "#f0f0f0",
                        padding: "1rem",
                        marginTop: "1rem",
                        borderRadius: "4px",
                        overflowX: "auto",
                    }}
                >
                    {content}
                </pre>
            )}
        </div>
    );
}
