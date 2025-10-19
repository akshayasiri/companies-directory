// src/App.js
import React, { useEffect, useState } from "react";
import companies from "./companies"; // <- default export
import "./App.css";

function App() {
  const data = companies; // use the imported data
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const perPage = 4;

  useEffect(() => {
    setPage(1);
  }, [search, industry, sortOrder]);

  const industries = ["All", ...Array.from(new Set(data.map(c => c.industry).filter(Boolean)))];

  const filtered = data
    .filter(c => {
      const q = search.trim().toLowerCase();
      const matches = (c.name || "").toLowerCase().includes(q) || (c.location || "").toLowerCase().includes(q);
      const matchesIndustry = industry === "All" || c.industry === industry;
      return matches && matchesIndustry;
    })
    .sort((a, b) => sortOrder === "asc" ? (a.name || "").localeCompare(b.name || "") : (b.name || "").localeCompare(a.name || ""));

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="App">
      <h1>Companies Directory</h1>

      <div className="page-info">
        <h2>Welcome to the Companies Directory</h2>
        <p>Explore top companies across various industries. This is used by Frontlinedutech. Use search, filters, sorting, and pagination to navigate.</p>
      </div>

      <div className="controls">
        <input
          className="search-input"
          placeholder="Search by name or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
          {industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <div className="sort-buttons">
          <button onClick={() => setSortOrder("asc")} className={sortOrder==="asc"?"active":""}>Sort A-Z</button>
          <button onClick={() => setSortOrder("desc")} className={sortOrder==="desc"?"active":""}>Sort Z-A</button>
        </div>
      </div>

      <div className="companies-container">
        {pageItems.length === 0 ? <div className="empty">No companies found.</div> :
          pageItems.map(c => (
            <div key={c.id} className="company-card" data-company={c.name}>
              <img
                src={c.logo || "https://via.placeholder.com/80?text=No+Logo"}
                alt={c.name}
                className="company-logo"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://via.placeholder.com/80?text=No+Logo"; }}
              />
              <h3>{c.name}</h3>
              <p className="muted">Location: {c.location}</p>
              <p className="muted">Industry: {c.industry}</p>
            </div>
          ))
        }
      </div>

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Previous</button>
        <span>Page {page} of {totalPages} — {filtered.length} results</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>Next</button>
      </div>
    </div>
  );
}

export default App;