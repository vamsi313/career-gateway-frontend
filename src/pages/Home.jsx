import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { careers } from '../data/careers';
import './Home.css';

function Home() {
  const { user } = useAuth();

  const categories = [
    { name: 'Business', icon: '💼', color: '#ec4899' },
    { name: 'Technology', icon: '💻', color: '#6366f1' },
    { name: 'Research', icon: '🔬', color: '#8b5cf6' },
    { name: 'Creative', icon: '🎨', color: '#f59e0b' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="hero-eyebrow">Career navigation for ambitious learners</span>
              <h1 className="hero-title">Find the work that fits you.</h1>
              <p className="hero-description">
                Premium assessments and guidance for B.Tech, M.Tech, MBA, and BBA students
                who want clarity and confidence in their next step.
              </p>
              <div className="hero-actions">
                {user ? (
                  <>
                    <Link to="/assessments" className="btn btn-primary btn-large">
                      Start Assessment
                    </Link>
                    <Link to="/career-explorer" className="btn btn-secondary btn-large">
                      Explore Careers
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="btn btn-primary btn-large">
                      Get Started
                    </Link>
                    <Link to="/signin" className="btn btn-secondary btn-large">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-value">12+</span>
                  <span className="stat-label">Assessments</span>
                </div>
                <div className="stat">
                  <span className="stat-value">45</span>
                  <span className="stat-label">Career Paths</span>
                </div>
                <div className="stat">
                  <span className="stat-value">4</span>
                  <span className="stat-label">Skill Tracks</span>
                </div>
              </div>
            </div>
            <div className="hero-panel">
              <div className="panel-card">
                <span className="panel-title">Your path, mapped.</span>
                <p className="panel-copy">
                  Match your strengths with roles that feel natural. Track progress with
                  insight-rich reports and a realistic growth plan.
                </p>
                <div className="panel-list">
                  <div className="panel-item">
                    <span className="panel-dot"></span>
                    Personality + aptitude alignment
                  </div>
                  <div className="panel-item">
                    <span className="panel-dot"></span>
                    Skill gap breakdowns
                  </div>
                  <div className="panel-item">
                    <span className="panel-dot"></span>
                    Curated learning paths
                  </div>
                </div>
              </div>
              <div className="panel-grid">
                {categories.map((category, index) => (
                  <div 
                    key={index} 
                    className="focus-card"
                    style={{ borderColor: category.color }}
                  >
                    <span className="focus-icon">{category.icon}</span>
                    <span className="focus-name">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="career-scroll-section">
        <div className="container">
          <div className="career-scroll-header">
            <div>
              <p className="section-eyebrow">Career options</p>
              <h2 className="section-title">Explore every career path in one swipe.</h2>
            </div>
            <Link to="/career-explorer" className="btn btn-secondary">
              Open Explorer
            </Link>
          </div>
        </div>
        <div className="career-scroll-track" aria-label="Career options">
          <div className="career-scroll-marquee">
            <div className="career-scroll-row">
              {careers.map((career) => (
                <div key={career.id} className="career-scroll-pill">
                  {career.title}
                </div>
              ))}
            </div>
            <div className="career-scroll-row" aria-hidden="true">
              {careers.map((career) => (
                <div key={`dup-${career.id}`} className="career-scroll-pill">
                  {career.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">The Career Gateway advantage</p>
            <h2 className="section-title">Designed for decisive career moves.</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Assessment</h3>
              <p>Tests aligned to your degree, goals, and readiness level.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Insightful Analytics</h3>
              <p>Clarity on strengths, gaps, and next steps with rich reports.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Career Intelligence</h3>
              <p>Role fit, salary ranges, and growth prospects in one view.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Learning Resources</h3>
              <p>Curated content to close gaps fast and build confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">How it works</p>
            <h2 className="section-title">A clear, guided journey in four steps.</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account in less than a minute.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Take Assessments</h3>
              <p>Complete personality, skills, and interest evaluations.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get Results</h3>
              <p>Receive an executive-style report and recommendations.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Explore Careers</h3>
              <p>Choose your path and follow a clear learning plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to make your next move?</h2>
            <p>Join students and professionals who choose their careers with clarity.</p>
            {!user && (
              <Link to="/signup" className="btn btn-primary btn-large">
                Start Your Journey Today
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;