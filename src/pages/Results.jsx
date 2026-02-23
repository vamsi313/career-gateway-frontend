import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import mammoth from 'mammoth/mammoth.browser';
import { careers } from '../data/careers';
import { calculateCategoryScores, getRecommendedCareers } from '../utils/recommendations';
import { trackEvent } from '../utils/analytics';
import './Results.css';

function Results() {
  const [results, setResults] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('personality');
  const [strengths, setStrengths] = useState([]);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [selectedCompletedAt, setSelectedCompletedAt] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeMatches, setResumeMatches] = useState([]);
  const [resumeMatchScore, setResumeMatchScore] = useState(null);
  const [resumeMissingSkills, setResumeMissingSkills] = useState([]);
  const [resumeError, setResumeError] = useState('');

  useEffect(() => {
    const savedResults = localStorage.getItem('assessmentResults');
    const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    setHistoryEntries(history);

    if (history.length > 0) {
      const latestEntry = history[history.length - 1];
      applyResults(latestEntry.results, latestEntry.completedAt, latestEntry.id);
      return;
    }

    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      applyResults(parsedResults, getLatestCompletedAt(parsedResults), 'latest');
    }
  }, []);

  const getLatestCompletedAt = (assessmentResults) => {
    if (!assessmentResults) {
      return null;
    }

    const timestamps = Object.values(assessmentResults)
      .map((entry) => (entry?.completedAt ? new Date(entry.completedAt).getTime() : null))
      .filter((value) => value !== null);

    if (!timestamps.length) {
      return null;
    }

    return new Date(Math.max(...timestamps)).toISOString();
  };

  const getDefaultTab = (assessmentResults) => {
    if (assessmentResults?.personality) {
      return 'personality';
    }
    if (assessmentResults?.skills) {
      return 'skills';
    }
    if (assessmentResults?.interest) {
      return 'interest';
    }
    return 'personality';
  };

  const applyResults = (assessmentResults, completedAt, historyId) => {
    setResults(assessmentResults);
    setSelectedCompletedAt(completedAt || getLatestCompletedAt(assessmentResults));
    setSelectedHistoryId(historyId ?? null);
    generateRecommendations(assessmentResults);
    generateStrengths(assessmentResults);
    setActiveTab(getDefaultTab(assessmentResults));
  };

  const generateRecommendations = (assessmentResults) => {
    const recommended = getRecommendedCareers(assessmentResults, careers, 8);
    setRecommendations(recommended);
  };

  const generateStrengths = (assessmentResults) => {
    const collected = [];

    if (assessmentResults.personality?.answers) {
      Object.entries(calculateCategoryScores(assessmentResults.personality.answers)).forEach(([category, score]) => {
        collected.push({ category, score, source: 'Personality' });
      });
    }

    if (assessmentResults.skills?.answers) {
      Object.entries(calculateCategoryScores(assessmentResults.skills.answers)).forEach(([category, score]) => {
        collected.push({ category, score, source: 'Skills' });
      });
    }

    if (assessmentResults.interest?.answers) {
      Object.entries(calculateCategoryScores(assessmentResults.interest.answers)).forEach(([category, score]) => {
        collected.push({ category, score, source: 'Interest' });
      });
    }

    const topStrengths = collected
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => ({ ...item, score: Number(item.score).toFixed(1) }));

    setStrengths(topStrengths);
  };

  const extractKeywords = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2);
  };

  const extractTextFromPdf = async (file) => {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    const pdfDocument = await pdfjsLib.getDocument({ data: typedArray, disableWorker: true }).promise;
    let combinedText = '';

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      combinedText += ` ${pageText}`;
    }

    return combinedText.trim();
  };

  const extractTextFromWord = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const extracted = await mammoth.extractRawText({ arrayBuffer });
    return (extracted.value || '').trim();
  };

  const analyzeResumeContent = (content) => {
    if (!content.trim()) {
      setResumeError('Please paste resume text or upload your PDF/Word resume.');
      return;
    }

    const normalizedContent = content.toLowerCase();
    const keywordSet = new Set(extractKeywords(content));

    const scoredCareers = careers
      .map((career) => {
        const matchedSkills = career.skills.filter((skill) => normalizedContent.includes(skill.toLowerCase()));
        const titleHit = career.title.toLowerCase().split(' ').some((word) => keywordSet.has(word));
        const categoryHit = normalizedContent.includes(career.category.toLowerCase());

        const skillCoverage = (matchedSkills.length / career.skills.length) * 70;
        const titleScore = titleHit ? 20 : 0;
        const categoryScore = categoryHit ? 10 : 0;
        const score = Math.round(skillCoverage + titleScore + categoryScore);

        return {
          ...career,
          resumeMatchScore: Math.max(0, Math.min(100, score)),
          matchedSkills
        };
      })
      .filter((career) => career.resumeMatchScore >= 15)
      .sort((a, b) => b.resumeMatchScore - a.resumeMatchScore)
      .slice(0, 5);

    if (!scoredCareers.length) {
      setResumeError('No strong resume matches found yet. Add more role-specific keywords and skills.');
      setResumeMatches([]);
      setResumeMatchScore(0);
      setResumeMissingSkills([]);
      return;
    }

    const topCareer = scoredCareers[0];
    const missingSkills = topCareer.skills.filter((skill) => !topCareer.matchedSkills.includes(skill)).slice(0, 5);

    setResumeError('');
    setResumeMatches(scoredCareers);
    setResumeMatchScore(topCareer.resumeMatchScore);
    setResumeMissingSkills(missingSkills);
    trackEvent('resume_analyzed', {
      topResumeCareer: topCareer.title,
      topResumeScore: topCareer.resumeMatchScore
    });
  };

  const handleResumeFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setResumeFileName(file.name);
    const fileName = file.name.toLowerCase();

    try {
      let extractedText = '';

      if (fileName.endsWith('.pdf')) {
        extractedText = await extractTextFromPdf(file);
      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        extractedText = await extractTextFromWord(file);
      } else {
        setResumeError('Unsupported file type. Please upload PDF or Word document.');
        return;
      }

      if (!extractedText) {
        setResumeError('Could not extract text from this file. Please try another resume file.');
        return;
      }

      setResumeText(extractedText);
      analyzeResumeContent(extractedText);
    } catch {
      setResumeError('Could not process this document. Please upload a readable PDF or DOCX file.');
    }
  };

  const downloadRoadmapPdf = () => {
    const topCareer = recommendations[0] || resumeMatches[0];
    if (!topCareer) {
      setResumeError('Complete assessments first to generate your personalized roadmap.');
      return;
    }

    const profileStrengths = strengths.slice(0, 3).map((item) => item.category);
    const roadmapSteps = [
      `Month 1: Build foundational skills in ${topCareer.skills.slice(0, 2).join(' and ')}.`,
      `Month 2: Build 2 portfolio projects aligned to ${topCareer.title} responsibilities.`,
      `Month 3: Improve communication and interview readiness with mock interviews weekly.`,
      `Month 4: Apply to ${topCareer.category} roles and optimize your resume with measurable impact.`
    ];

    const doc = new jsPDF();
    let y = 20;

    const writeLine = (text, fontSize = 11, spacing = 8) => {
      doc.setFontSize(fontSize);
      const wrapped = doc.splitTextToSize(text, 170);
      doc.text(wrapped, 20, y);
      y += wrapped.length * spacing;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    };

    doc.setFont('helvetica', 'bold');
    writeLine('Career Gateway - Personalized Career Roadmap', 16, 9);
    doc.setFont('helvetica', 'normal');
    writeLine(`Generated on: ${new Date().toLocaleString()}`);
    writeLine(`Primary Career Target: ${topCareer.title}`);
    writeLine(`Category: ${topCareer.category}`);
    writeLine(`Career Match Score: ${topCareer.fitScore || topCareer.resumeMatchScore || 0}%`);
    writeLine(`Top Strength Signals: ${profileStrengths.join(', ') || 'Not available yet'}`);
    writeLine('');
    doc.setFont('helvetica', 'bold');
    writeLine('Roadmap Plan', 13);
    doc.setFont('helvetica', 'normal');
    roadmapSteps.forEach((step) => writeLine(`• ${step}`));
    writeLine('');
    doc.setFont('helvetica', 'bold');
    writeLine('Priority Skills', 13);
    doc.setFont('helvetica', 'normal');
    writeLine(topCareer.skills.join(', '));

    if (resumeMissingSkills.length) {
      writeLine('');
      doc.setFont('helvetica', 'bold');
      writeLine('Skills to Add to Resume', 13);
      doc.setFont('helvetica', 'normal');
      writeLine(resumeMissingSkills.join(', '));
    }

    doc.save('career-roadmap.pdf');
    trackEvent('roadmap_pdf_downloaded', { careerTarget: topCareer.title });
  };

  if (!results) {
    return (
      <div className="results-page">
        <div className="container">
          <div className="no-results-message">
            <h2>No Assessment Results Found</h2>
            <p>Please complete at least one assessment to see your results</p>
            <Link to="/assessments" className="btn btn-primary">
              Take Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="page-header">
        <h1>Your Assessment Results</h1>
        <p>Detailed analysis of your personality, skills, and interests</p>
      </div>

      <div className="container">
        <div className="results-summary">
          <div className="summary-card">
            <div className="summary-icon">✅</div>
            <div className="summary-content">
              <h3>Assessments Completed</h3>
              <p className="summary-value">
                {Object.keys(results).length} / 3
              </p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🎯</div>
            <div className="summary-content">
              <h3>Top Career Fit</h3>
              <p className="summary-value">{recommendations[0]?.fitScore || 0}%</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <h3>Completion Date</h3>
              <p className="summary-value">
                {selectedCompletedAt ? new Date(selectedCompletedAt).toLocaleDateString() : 'Not available'}
              </p>
            </div>
          </div>
        </div>

        {historyEntries.length > 0 && (
          <div className="history-section">
            <h2>Past Assessments</h2>
            <p className="history-subtitle">Review previously completed sessions and their results.</p>
            <div className="history-grid">
              {[...historyEntries].reverse().map((entry) => {
                const completedCount = Object.keys(entry.results || {}).length;
                const isActive = selectedHistoryId === entry.id;

                return (
                  <button
                    key={entry.id}
                    className={`history-card ${isActive ? 'active' : ''}`}
                    onClick={() => applyResults(entry.results, entry.completedAt, entry.id)}
                  >
                    <div className="history-card-top">
                      <span className="history-badge">{completedCount} / 3 complete</span>
                      <span className="history-date">
                        {entry.completedAt ? new Date(entry.completedAt).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                    <p className="history-label">Assessment session</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {Object.keys(results).length < 3 && (
          <div className="incomplete-notice">
            <h3>⚠️ Complete All Assessments</h3>
            <p>Take all three assessments for the most accurate career recommendations</p>
            <Link to="/assessments" className="btn btn-secondary">
              Continue Assessments
            </Link>
          </div>
        )}

        <div className="results-tabs">
          {results.personality && (
            <button
              className={`tab-button ${activeTab === 'personality' ? 'active' : ''}`}
              onClick={() => setActiveTab('personality')}
            >
              🧠 Personality
            </button>
          )}
          {results.skills && (
            <button
              className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              ⚡ Skills
            </button>
          )}
          {results.interest && (
            <button
              className={`tab-button ${activeTab === 'interest' ? 'active' : ''}`}
              onClick={() => setActiveTab('interest')}
            >
              ❤️ Interests
            </button>
          )}
        </div>

        <div className="results-content">
          {activeTab === 'personality' && results.personality && (
            <div className="result-section">
              <h2>Personality Assessment Results</h2>
              <div className="scores-grid">
                {Object.entries(calculateCategoryScores(results.personality.answers)).map(([category, score]) => (
                  <div key={category} className="score-card">
                    <h4>{category}</h4>
                    <div className="score-bar-container">
                      <div 
                        className="score-bar"
                        style={{ width: `${(Number(score) / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="score-value">{Number(score).toFixed(1)} / 5.0</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && results.skills && (
            <div className="result-section">
              <h2>Skills Evaluation Results</h2>
              <div className="scores-grid">
                {Object.entries(calculateCategoryScores(results.skills.answers)).map(([category, score]) => (
                  <div key={category} className="score-card">
                    <h4>{category}</h4>
                    <div className="score-bar-container">
                      <div 
                        className="score-bar skills"
                        style={{ width: `${(Number(score) / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="score-value">{Number(score).toFixed(1)} / 5.0</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'interest' && results.interest && (
            <div className="result-section">
              <h2>Interest Profiler Results</h2>
              <div className="scores-grid">
                {Object.entries(calculateCategoryScores(results.interest.answers)).map(([category, score]) => (
                  <div key={category} className="score-card">
                    <h4>{category}</h4>
                    <div className="score-bar-container">
                      <div 
                        className="score-bar interest"
                        style={{ width: `${(Number(score) / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className="score-value">{Number(score).toFixed(1)} / 5.0</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {strengths.length > 0 && (
          <div className="strengths-section">
            <h2>Your Top Strength Signals</h2>
            <div className="strengths-grid">
              {strengths.map((strength, index) => (
                <div key={`${strength.category}-${index}`} className="strength-card">
                  <h4>{strength.category}</h4>
                  <p className="strength-score">{strength.score} / 5.0</p>
                  <span className="strength-source">{strength.source}</span>
                </div>
              ))}
            </div>

            <div className="roadmap-actions">
              <button className="btn btn-primary" onClick={downloadRoadmapPdf}>
                Download Personalized Roadmap PDF
              </button>
            </div>
          </div>
        )}

        <div className="resume-intelligence-section">
          <h2>Resume-Based Career Matching</h2>
          <p className="resume-subtitle">
            Paste your resume text or upload a PDF/Word resume to discover your strongest role alignment instantly.
          </p>

          <div className="resume-inputs">
            <textarea
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste your resume content here..."
              rows={8}
            />

            <div className="resume-actions">
              <label className="upload-btn">
                Upload Resume (.pdf, .doc, .docx)
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFileUpload} />
              </label>
              <button className="btn btn-secondary" onClick={() => analyzeResumeContent(resumeText)}>
                Analyze Resume
              </button>
            </div>

            {resumeFileName && <p className="resume-file-name">Uploaded: {resumeFileName}</p>}
            {resumeError && <p className="resume-error">{resumeError}</p>}
          </div>

          {resumeMatches.length > 0 && (
            <div className="resume-results-grid">
              <div className="resume-score-card">
                <h3>Top Resume Match</h3>
                <p className="resume-score">{resumeMatchScore}%</p>
                <p>{resumeMatches[0]?.title}</p>
              </div>

              <div className="resume-score-card">
                <h3>Missing Skills to Add</h3>
                <ul>
                  {resumeMissingSkills.length ? (
                    resumeMissingSkills.map((skill, index) => <li key={index}>{skill}</li>)
                  ) : (
                    <li>Your resume already covers key skills well</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="recommendations-section">
          <h2>Recommended Careers for You</h2>
          <p className="recommendations-subtitle">
            Personalized by your assessment patterns, skill signals, and interest profile
          </p>
          
          <div className="careers-grid">
            {recommendations.map((career) => (
              <div key={career.id} className="career-recommendation-card">
                <div className="fit-score-badge">{career.fitScore}% Match</div>
                <div className="career-icon">{career.icon}</div>
                <h3>{career.title}</h3>
                <p className="career-category">{career.category}</p>
                <p className="career-description">{career.description}</p>
                
                <div className="career-info">
                  <div className="info-badge">
                    <span>💰 {career.salary}</span>
                  </div>
                  <div className="info-badge">
                    <span>🎓 {career.education}</span>
                  </div>
                </div>

                <div className="career-skills">
                  {career.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>

                <ul className="career-reasons">
                  {(career.reasons || []).map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="explore-more">
            <Link to="/career-explorer" className="btn btn-primary">
              Explore All Careers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;