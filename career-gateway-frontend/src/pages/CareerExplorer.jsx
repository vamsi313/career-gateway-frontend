import React, { useEffect, useMemo, useState } from 'react';
import { careers, categories } from '../data/careers';
import { getRecommendedCareers, sortCareers } from '../utils/recommendations';
import './CareerExplorer.css';

function CareerExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [sortBy, setSortBy] = useState('match');
  const [favorites, setFavorites] = useState([]);
  const [personalizedCareers, setPersonalizedCareers] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteCareers') || '[]');
    setFavorites(storedFavorites);

    const assessmentResults = JSON.parse(localStorage.getItem('assessmentResults') || '{}');
    const personalized = getRecommendedCareers(assessmentResults, careers, careers.length);
    setPersonalizedCareers(personalized);
  }, []);

  const allSkills = useMemo(() => {
    const uniqueSkills = new Set();
    careers.forEach((career) => {
      career.skills.forEach((skill) => uniqueSkills.add(skill));
    });
    return ['All Skills', ...Array.from(uniqueSkills).sort((a, b) => a.localeCompare(b))];
  }, []);

  const baseCareerList = personalizedCareers.length ? personalizedCareers : careers;

  const filteredCareers = baseCareerList.filter((career) => {
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = selectedSkill === 'All Skills' || career.skills.includes(selectedSkill);
    const matchesFavorites = !showFavoritesOnly || favorites.includes(career.id);

    return matchesCategory && matchesSearch && matchesSkill && matchesFavorites;
  });

  const finalCareers = sortCareers(filteredCareers, sortBy);

  const toggleFavorite = (careerId) => {
    const updatedFavorites = favorites.includes(careerId)
      ? favorites.filter((id) => id !== careerId)
      : [...favorites, careerId];

    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteCareers', JSON.stringify(updatedFavorites));
  };

  const topCareerMatch = finalCareers[0]?.fitScore || 0;

  return (
    <div className="career-explorer-page">
      <div className="page-header">
        <h1>Career Explorer</h1>
        <p>Discover and shortlist the best-fit careers with intelligent matching and advanced exploration tools</p>
      </div>

      <div className="container">
        <div className="explorer-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="advanced-controls">
            <select value={selectedSkill} onChange={(event) => setSelectedSkill(event.target.value)}>
              {allSkills.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>

            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="match">Sort: Best Match</option>
              <option value="salary">Sort: Highest Salary</option>
              <option value="title">Sort: A-Z</option>
            </select>

            <button
              className={`favorites-toggle ${showFavoritesOnly ? 'active' : ''}`}
              onClick={() => setShowFavoritesOnly((previous) => !previous)}
            >
              {showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites'}
            </button>
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`category-filter ${selectedCategory === category.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="filter-icon">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="results-info">
          <p>
            Showing {finalCareers.length} careers • Favorites: {favorites.length} • Top Match: {topCareerMatch}%
          </p>
        </div>

        <div className="careers-grid">
          {finalCareers.map((career) => (
            <div key={career.id} className="career-card" onClick={() => setSelectedCareer(career)}>
              <button
                className={`favorite-btn ${favorites.includes(career.id) ? 'active' : ''}`}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleFavorite(career.id);
                }}
              >
                {favorites.includes(career.id) ? '★' : '☆'}
              </button>

              {career.fitScore && <div className="match-badge">{career.fitScore}% Match</div>}
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
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                  {career.skills.length > 3 && (
                    <span className="skill-tag more">+{career.skills.length - 3}</span>
                  )}
                </div>

                {career.reasons?.length > 0 && (
                  <ul className="career-reasons">
                    {career.reasons.slice(0, 2).map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                )}

                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>

        {finalCareers.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No careers found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {selectedCareer && (
        <div className="modal-overlay" onClick={() => setSelectedCareer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCareer(null)}>×</button>
            
            <div className="modal-header">
              <div className="modal-icon">{selectedCareer.icon}</div>
              <div>
                <h2>{selectedCareer.title}</h2>
                <p className="modal-category">{selectedCareer.category}</p>
              </div>
            </div>

            <div className="modal-body">
              <section className="modal-section">
                <h3>Description</h3>
                <p>{selectedCareer.description}</p>
              </section>

              <section className="modal-section">
                <h3>Required Skills</h3>
                <div className="modal-skills">
                  {selectedCareer.skills.map((skill, index) => (
                    <span key={index} className="skill-tag large">{skill}</span>
                  ))}
                </div>
              </section>

              <section className="modal-section">
                <h3>Salary Range</h3>
                <p className="salary-info">{selectedCareer.salary}</p>
              </section>

              <section className="modal-section">
                <h3>Educational Requirements</h3>
                <p className="education-info">{selectedCareer.education}</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CareerExplorer;