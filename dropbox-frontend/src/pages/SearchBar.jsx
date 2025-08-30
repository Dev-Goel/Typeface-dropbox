import { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");
    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
    };
    return (
        <form onSubmit={handleSearch}>
            <input
                type="text" placeholder="Search for file.." value={query} onChange={(e) => setQuery(e.target.value)}>
            </input>
            <button type="submit">
                Search
            </button>
        </form>
    )
} 