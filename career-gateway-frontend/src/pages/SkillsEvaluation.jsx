import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { skillsQuestions, ratingOptions } from '../data/questions';
import { trackEvent } from '../utils/analytics';
import { apiCall } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './PersonalityTest.css';

function SkillsEvaluation() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    trackEvent('assessment_started', { assessmentType: 'skills' });
  }, []);

  const progress = ((currentQuestion + 1) / skillsQuestions.length) * 100;

  const handleAnswer = async (value) => {
    const newAnswers = {
      ...answers,
      [skillsQuestions[currentQuestion].id]: {
        question: skillsQuestions[currentQuestion].question,
        category: skillsQuestions[currentQuestion].category,
        value: value
      }
    };
    setAnswers(newAnswers);

    if (currentQuestion < skillsQuestions.length - 1) {
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
              assessmentType: 'skills',
              answersJson: JSON.stringify(newAnswers)
            }
          });
        } catch (err) {
          console.error('Failed to save to backend:', err);
        }
      }

      trackEvent('assessment_completed', {
        assessmentType: 'skills',
        questionCount: skillsQuestions.length
      });
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = skillsQuestions[currentQuestion];

  return (
    <div className="test-page">
      <div className="container">
        <div className="test-header">
          <h1>Skills Evaluation</h1>
          <p>Question {currentQuestion + 1} of {skillsQuestions.length}</p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="test-container">
          <div className="question-card">
            <div className="question-number">Question {currentQuestion + 1}</div>
            <h2 className="question-text">Rate your proficiency in:</h2>
            <h3 className="skill-name">{question.question}</h3>
            <p className="question-category">Category: {question.category}</p>

            <div className="options-container">
              {ratingOptions.map((option) => (
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
                {currentQuestion === skillsQuestions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>

          <div className="test-sidebar">
            <h3>Progress Overview</h3>
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{currentQuestion + 1}/{skillsQuestions.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Remaining</span>
                <span className="stat-value">{skillsQuestions.length - currentQuestion - 1}</span>
              </div>
            </div>

            <div className="test-tips">
              <h4>💡 Rating Guide</h4>
              <ul>
                <li><strong>Beginner:</strong> Basic knowledge</li>
                <li><strong>Novice:</strong> Some experience</li>
                <li><strong>Intermediate:</strong> Comfortable using</li>
                <li><strong>Advanced:</strong> Highly proficient</li>
                <li><strong>Expert:</strong> Master level</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsEvaluation;