import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interestQuestions, interestOptions } from '../data/questions';
import { trackEvent } from '../utils/analytics';
import { apiCall } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './PersonalityTest.css';

function InterestProfiler() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    trackEvent('assessment_started', { assessmentType: 'interest' });
  }, []);

  const progress = ((currentQuestion + 1) / interestQuestions.length) * 100;

  const handleAnswer = async (value) => {
    const newAnswers = {
      ...answers,
      [interestQuestions[currentQuestion].id]: {
        question: interestQuestions[currentQuestion].question,
        category: interestQuestions[currentQuestion].category,
        value: value
      }
    };
    setAnswers(newAnswers);

    if (currentQuestion < interestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save to backend only

      // Save to backend
      if (user?.id) {
        try {
          await apiCall('/assessments/save', {
            method: 'POST',
            body: {
              userId: user.id,
              assessmentType: 'interest',
              answersJson: JSON.stringify(newAnswers)
            }
          });
        } catch (err) {
          console.error('Failed to save to backend:', err);
        }
      }

      trackEvent('assessment_completed', {
        assessmentType: 'interest',
        questionCount: interestQuestions.length
      });
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = interestQuestions[currentQuestion];

  return (
    <div className="test-page">
      <div className="container">
        <div className="test-header">
          <h1>Interest Profiler</h1>
          <p>Question {currentQuestion + 1} of {interestQuestions.length}</p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="test-container">
          <div className="question-card">
            <div className="question-number">Question {currentQuestion + 1}</div>
            <h2 className="question-text">How interested are you in:</h2>
            <h3 className="skill-name">{question.question}</h3>
            <p className="question-category">Category: {question.category}</p>

            <div className="options-container">
              {interestOptions.map((option) => (
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
                {currentQuestion === interestQuestions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>

          <div className="test-sidebar">
            <h3>Progress Overview</h3>
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{currentQuestion + 1}/{interestQuestions.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Remaining</span>
                <span className="stat-value">{interestQuestions.length - currentQuestion - 1}</span>
              </div>
            </div>

            <div className="test-tips">
              <h4>❤️ Interest Levels</h4>
              <ul>
                <li><strong>Not Interested:</strong> No appeal</li>
                <li><strong>Slightly:</strong> Some curiosity</li>
                <li><strong>Moderately:</strong> Decent interest</li>
                <li><strong>Very:</strong> Strong interest</li>
                <li><strong>Extremely:</strong> Passionate about it</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterestProfiler;