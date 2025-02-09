import React from "react";

function JobListing({ title, company, url }) {
  return (
    <div className="job-card">
      <h2 className="job-title">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h2>
      <p className="job-company">{company}</p>
    </div>
  );
}

export default JobListing;
