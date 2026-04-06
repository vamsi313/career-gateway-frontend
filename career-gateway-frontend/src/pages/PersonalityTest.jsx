import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { personalityQuestions, agreementOptions } from '../data/questions';
import { trackEvent } from '../utils/analytics';
import { apiCall } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './PersonalityTest.css';

function PersonalityTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showProgress, setShowProgress] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    trackEvent('assessment_started', { assessmentType: 'personality' });
  }, []);

  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

  const handleAnswer = async (value) => {
    const newAnswers = {
      ...answers,
      [personalityQuestions[currentQuestion].id]: {
        question: personalityQuestions[currentQuestion].question,
        category: personalityQuestions[currentQuestion].category,
        value: value
      }
    };
    setAnswers(newAnswers);

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save results to localStorage and backend
      const existingResults = JSON.parse(localStorage.getItem('assessmentResults') || '{}');
      existingResults.personality = {
        answers: newAnswers,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('assessmentResults', JSON.stringify(existingResults));
      const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      history.push({
        id: Date.now(),
        completedAt: new Date().toISOString(),
        results: existingResults
      });
      localStorage.setItem('assessmentHistory', JSON.stringify(history));

      // Save to backend
      if (user?.id) {
        try {
          await apiCall('/assessments/save', {
            method: 'POST',
            body: {
              userId: user.id,
              assessmentType: 'personality',
              answersJson: JSON.stringify(newAnswers)
            }
          });
        } catch (err) {
          console.error('Failed to save to backend:', err);
        }
      }

      trackEvent('assessment_completed', {
        assessmentType: 'personality',
        questionCount: personalityQuestions.length
      });
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = personalityQuestions[currentQuestion];

  return (
    <div className="test-page">
      <div className="container">
        <div className="test-header">
          <h1>Personality Assessment</h1>
          <p>Question {currentQuestion + 1} of {personalityQuestions.length}</p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="test-container">
          <div className="question-card">
            <div className="question-number">Question {currentQuestion + 1}</div>
            <h2 className="question-text">{question.question}</h2>
            <p className="question-category">Category: {question.category}</p>

            <div className="options-container">
              {agreementOptions.map((option) => (
                <button
                  key={option.value}
                  className={`option-button ${answers[question.id]?.value === option.value ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <span className="option-value">{option.value}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>

            <div className="navigation-buttons">
              <button
                className="btn btn-secondary"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleAnswer(answers[question.id]?.value || 3)}
                disabled={!answers[question.id]}
              >
                {currentQuestion === personalityQuestions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>

          <div className="test-sidebar">
            <h3>Progress Overview</h3>
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{currentQuestion + 1}/{personalityQuestions.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Remaining</span>
                <span className="stat-value">{personalityQuestions.length - currentQuestion - 1}</span>
              </div>
            </div>

            <div className="test-tips">
              <h4>💡 Tips</h4>
              <ul>
                <li>Answer honestly</li>
                <li>Don't overthink</li>
                <li>Trust your instincts</li>
                <li>No right or wrong answers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalityTest;