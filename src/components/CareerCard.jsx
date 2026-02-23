// src/components/CareerCard.jsx

import React from "react";
import "./CareerCard.css";

function CareerCard({ career, onClick }) {
  return (
    <div className="career-card" onClick={() => onClick(career)}>
      <div className="career-icon">{career.icon}</div>

      <div className="career-content">
        <h3>{career.title}</h3>
        <p className="career-category">{career.category}</p>
        <p className="career-description">{career.description}</p>

        <div className="career-info">
          <div className="info-badge">
            <span className="badge-icon">💰</span>
            <span>{career.salary}</span>
          </div>

          <div className="info-badge">
            <span className="badge-icon">🎓</span>
            <span>{career.education}</span>
          </div>
        </div>

        <div className="career-skills">
          {career.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}

          {career.skills.length > 3 && (
            <span className="skill-tag more">
              +{career.skills.length - 3}
            </span>
          )}
        </div>

        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );
}

export default CareerCard;
