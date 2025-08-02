import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import FileViewer from "./pages/FileViewer";

export default function App() {
  return (
    <div className="container">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/file/:id" element={<FileViewer />} />
      </Routes>
    </div>
  );
}
