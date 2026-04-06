import React from 'react';
import { Link } from 'react-router-dom';
import './Resources.css';

function Resources() {
  const resources = [
    {
      category: 'Programming',
      icon: '💻',
      description: 'Build strong development fundamentals and interview-ready coding skills.',
      items: [
        { title: 'freeCodeCamp', description: 'Structured web development and Python tracks', url: 'https://www.freecodecamp.org/', level: 'Beginner' },
        { title: 'Codecademy', description: 'Interactive coding paths with guided practice', url: 'https://www.codecademy.com/', level: 'Beginner to Intermediate' },
        { title: 'LeetCode', description: 'DSA practice for coding interviews', url: 'https://leetcode.com/', level: 'Intermediate to Advanced' },
        { title: 'GitHub Skills', description: 'Hands-on Git, GitHub, and collaboration labs', url: 'https://skills.github.com/', level: 'All Levels' }
      ]
    },
    {
      category: 'Data Science',
      icon: '📊',
      description: 'Master analytics, machine learning, and applied data workflows.',
      items: [
        { title: 'Kaggle', description: 'Datasets, notebooks, and competitions', url: 'https://www.kaggle.com/', level: 'All Levels' },
        { title: 'DataCamp', description: 'Short, focused data science learning paths', url: 'https://www.datacamp.com/', level: 'Beginner to Intermediate' },
        { title: 'Coursera Machine Learning', description: 'Foundational ML by top universities', url: 'https://www.coursera.org/browse/data-science/machine-learning', level: 'Intermediate' },
        { title: 'Google Colab', description: 'Run Python notebooks in the cloud for free', url: 'https://colab.research.google.com/', level: 'All Levels' }
      ]
    },
    {
      category: 'Business & Management',
      icon: '💼',
      description: 'Develop strategic thinking, execution, and leadership capabilities.',
      items: [
        { title: 'Harvard Business Review', description: 'Practical insights on strategy and leadership', url: 'https://hbr.org/', level: 'All Levels' },
        { title: 'MBA Crystal Ball', description: 'MBA admissions and career guidance', url: 'https://www.mbacrystalball.com/', level: 'Aspirants' },
        { title: 'LinkedIn Learning', description: 'Professional courses for business skills', url: 'https://www.linkedin.com/learning/', level: 'All Levels' },
        { title: 'Coursera Business', description: 'Business, finance, and management programs', url: 'https://www.coursera.org/browse/business', level: 'Beginner to Advanced' }
      ]
    },
    {
      category: 'Design',
      icon: '🎨',
      description: 'Improve visual communication, UX thinking, and portfolio quality.',
      items: [
        { title: 'Figma', description: 'UI/UX design workflows and collaboration', url: 'https://www.figma.com/', level: 'All Levels' },
        { title: 'Dribbble', description: 'Design inspiration and trend discovery', url: 'https://dribbble.com/', level: 'All Levels' },
        { title: 'Behance', description: 'Portfolio showcases and case studies', url: 'https://www.behance.net/', level: 'All Levels' },
        { title: 'Canva Design School', description: 'Learn core design principles quickly', url: 'https://www.canva.com/designschool/', level: 'Beginner' }
      ]
    },
    {
      category: 'Career Development',
      icon: '🚀',
      description: 'Position yourself for opportunities with better visibility and preparation.',
      items: [
        { title: 'LinkedIn', description: 'Networking, branding, and recruiter visibility', url: 'https://www.linkedin.com/', level: 'All Levels' },
        { title: 'Glassdoor', description: 'Salary insights and company reviews', url: 'https://www.glassdoor.com/', level: 'All Levels' },
        { title: 'Indeed', description: 'Large-scale job search and alerts', url: 'https://www.indeed.com/', level: 'All Levels' },
        { title: 'Wellfound', description: 'Startup jobs and early-stage opportunities', url: 'https://wellfound.com/', level: 'Beginner to Advanced' }
      ]
    },
    {
      category: 'Certifications',
      icon: '🎓',
      description: 'Validate your skills with recognized certification pathways.',
      items: [
        { title: 'Google Career Certificates', description: 'Job-focused professional certificates', url: 'https://grow.google/certificates/', level: 'Beginner to Intermediate' },
        { title: 'AWS Training & Certification', description: 'Cloud practitioner to architect tracks', url: 'https://aws.amazon.com/training/', level: 'All Levels' },
        { title: 'Microsoft Learn', description: 'Role-based learning and certifications', url: 'https://learn.microsoft.com/training/', level: 'All Levels' },
        { title: 'CompTIA', description: 'Industry-standard IT certifications', url: 'https://www.comptia.org/certifications', level: 'Beginner to Intermediate' }
      ]
    }
  ];

  const learningPaths = [
    {
      title: 'Tech Career Launch',
      duration: '12 Weeks',
      focus: 'Coding, projects, interview prep',
      milestones: ['Core programming', '2 portfolio projects', 'Mock interviews'],
      icon: '🧭'
    },
    {
      title: 'Data Science Starter',
      duration: '10 Weeks',
      focus: 'Statistics, Python, ML basics',
      milestones: ['EDA + visualization', '1 ML project', 'Kaggle profile'],
      icon: '📈'
    },
    {
      title: 'Business Growth Track',
      duration: '8 Weeks',
      focus: 'Strategy, communication, analytics',
      milestones: ['Business case studies', 'Presentation portfolio', 'Leadership practice'],
      icon: '📌'
    }
  ];

  const books = [
    { title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', category: 'Technical', reason: 'Best for interview preparation and problem-solving frameworks' },
    { title: 'The Lean Startup', author: 'Eric Ries', category: 'Business', reason: 'Build products with validated learning and iterative execution' },
    { title: 'Deep Work', author: 'Cal Newport', category: 'Productivity', reason: 'Improve focus and learn complex skills faster' },
    { title: 'The Design of Everyday Things', author: 'Don Norman', category: 'Design', reason: 'Understand user-centered product and interface thinking' },
    { title: 'Atomic Habits', author: 'James Clear', category: 'Personal Growth', reason: 'Build consistent habits for long-term career progress' },
    { title: 'Zero to One', author: 'Peter Thiel', category: 'Entrepreneurship', reason: 'Think deeply about innovation and value creation' }
  ];

  const actionPlan = [
    {
      week: 'Week 1-2',
      title: 'Assess and Select Direction',
      detail: 'Use assessments, shortlist one primary path, and define measurable goals.'
    },
    {
      week: 'Week 3-6',
      title: 'Build Core Skills',
      detail: 'Complete foundational courses and track daily practice consistency.'
    },
    {
      week: 'Week 7-10',
      title: 'Create Portfolio Work',
      detail: 'Build at least two projects with clear outcomes and documented learnings.'
    },
    {
      week: 'Week 11-12',
      title: 'Interview and Apply',
      detail: 'Polish resume, optimize LinkedIn, and apply with role-specific preparation.'
    }
  ];

  return (
    <div className="resources-page">
      <div className="page-header">
        <h1>Career Growth Resource Hub</h1>
        <p>Curated, high-impact resources to help you learn faster, build proof of skills, and grow with confidence.</p>
        <div className="header-metrics">
          <div className="metric-pill">
            <strong>24+</strong>
            <span>Top Platforms</span>
          </div>
          <div className="metric-pill">
            <strong>3</strong>
            <span>Guided Paths</span>
          </div>
          <div className="metric-pill">
            <strong>12 Weeks</strong>
            <span>Action Plan</span>
          </div>
        </div>
      </div>

      <div className="container">
        <section className="learning-paths-section">
          <h2>Structured Learning Paths</h2>
          <div className="learning-paths-grid">
            {learningPaths.map((path, index) => (
              <article key={index} className="learning-path-card">
                <div className="path-top">
                  <span className="path-icon">{path.icon}</span>
                  <span className="path-duration">{path.duration}</span>
                </div>
                <h3>{path.title}</h3>
                <p className="path-focus">{path.focus}</p>
                <ul>
                  {path.milestones.map((milestone, itemIndex) => (
                    <li key={itemIndex}>{milestone}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="resources-section">
          <h2>Premium Resource Library</h2>
          <div className="resources-grid">
            {resources.map((resource, index) => (
              <article key={index} className="resource-category-card">
                <div className="resource-category-header">
                  <div className="resource-header-main">
                    <span className="resource-icon">{resource.icon}</span>
                    <div>
                      <h3>{resource.category}</h3>
                      <p>{resource.description}</p>
                    </div>
                  </div>
                </div>
                <div className="resource-items">
                  {resource.items.map((item, idx) => (
                    <a key={idx} href={item.url} className="resource-item" target="_blank" rel="noreferrer">
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <span className="resource-level">{item.level}</span>
                      </div>
                      <span className="resource-arrow">↗</span>
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="books-section">
          <h2>Recommended Books</h2>
          <div className="books-grid">
            {books.map((book, index) => (
              <article key={index} className="book-card">
                <div className="book-icon">📖</div>
                <h3>{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <span className="book-category">{book.category}</span>
                <p className="book-reason">{book.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="action-plan-section">
          <h2>12-Week Career Action Plan</h2>
          <div className="action-plan-grid">
            {actionPlan.map((step, index) => (
              <article key={index} className="action-step-card">
                <span className="step-badge">{step.week}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tips-section">
          <h2>High-Impact Learning Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">⏰</div>
              <h3>Consistent Practice</h3>
              <p>Dedicate at least 30-60 focused minutes daily for continuous progress.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🎯</div>
              <h3>Set Clear Goals</h3>
              <p>Set measurable weekly outcomes and review your progress every Sunday.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">👥</div>
              <h3>Join Communities</h3>
              <p>Join active learning communities to stay accountable and get quick feedback.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔄</div>
              <h3>Build Projects</h3>
              <p>Convert learning into visible portfolio projects with real use-cases.</p>
            </div>
          </div>
        </section>

        <section className="resources-cta">
          <h2>Ready to turn resources into results?</h2>
          <p>Start with one path, follow the plan, and track your progress every week.</p>
          <div className="resources-cta-actions">
            <Link to="/assessments" className="btn btn-primary">Take Assessment</Link>
            <Link to="/career-explorer" className="btn btn-secondary">Explore Careers</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Resources;