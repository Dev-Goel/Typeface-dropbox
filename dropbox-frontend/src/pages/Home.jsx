import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    API.get("/files")
      .then((res) => {
        setFiles(res.data);
      })
      .catch((err) => {
        console.error("Error fetching files", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchFiles = (search = "") => {
    setLoading(true);
    API.get("/files", {params : {q: search}}).then((res) => setFiles(res.data)).catch((err) => console.error("Error fetching files", err)).finally(() => setLoading(false));
  }

  return (
    <div>
      <h2>Uploaded Files</h2>
      <SearchBar onSearch={fetchFiles}/>
      {loading ? (
        <p>Loading...</p>
      ) : files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul className="file-list">
          {files.map((file) => (
            <li key={file.id} className="file-item">
              <strong>{file.originalname}</strong> ({Math.round(file.size / 1024)} KB)
              <div>
                <a
                  href={`http://localhost:4000/api/download/${file.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
                {" | "}
                <Link to={`/file/${file.id}`}>View</Link>
                {" | "}
                <button onClick={()=> API.delete(`/files/${file.id}`).then(()=>
                  setFiles(files.filter(f => f.id !== file.id))
                )}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
