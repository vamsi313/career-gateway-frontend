const CAREER_CATEGORIES = ['Technology', 'Business', 'Creative', 'Research', 'Healthcare', 'Education'];

const categoryWeightMap = {
  skills: {
    Technical: { Technology: 1, Research: 0.4 },
    Creative: { Creative: 1, Education: 0.2 },
    Communication: { Business: 0.6, Education: 0.7, Healthcare: 0.3 },
    Management: { Business: 1, Education: 0.4 },
    Analytical: { Research: 0.9, Technology: 0.6, Business: 0.4 },
    Business: { Business: 1 },
    Interpersonal: { Healthcare: 0.6, Education: 0.6, Business: 0.4 }
  },
  interest: {
    Technology: { Technology: 1 },
    Creative: { Creative: 1 },
    Business: { Business: 1 },
    Research: { Research: 1 },
    Education: { Education: 1 },
    Service: { Healthcare: 0.7, Education: 0.4 },
    Engineering: { Technology: 0.8, Research: 0.4 },
    Health: { Healthcare: 1 },
    Management: { Business: 0.8, Education: 0.4 }
  },
  personality: {
    Teamwork: { Business: 0.4, Healthcare: 0.5, Education: 0.4 },
    Organization: { Business: 0.5, Education: 0.4, Healthcare: 0.3 },
    Communication: { Education: 0.6, Business: 0.4, Healthcare: 0.4 },
    'Problem Solving': { Technology: 0.6, Research: 0.7, Business: 0.3 },
    'Attention to Detail': { Research: 0.6, Healthcare: 0.5, Technology: 0.4 },
    Adaptability: { Technology: 0.4, Business: 0.3 },
    Leadership: { Business: 0.7, Education: 0.3 },
    Creativity: { Creative: 0.8, Business: 0.3 },
    Independence: { Research: 0.5, Technology: 0.4 },
    Analytical: { Research: 0.7, Technology: 0.5, Business: 0.3 },
    Empathy: { Healthcare: 0.8, Education: 0.5 },
    'Stress Management': { Healthcare: 0.5, Business: 0.3 },
    'Time Management': { Business: 0.4, Education: 0.3 },
    'Learning Agility': { Technology: 0.5, Research: 0.4 },
    Flexibility: { Business: 0.3, Technology: 0.3 }
  }
};

const normalizeScore = (score) => Math.max(0, Math.min(100, Math.round(score)));

const parseSalaryMin = (salary = '') => {
  const match = salary.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
};

export const calculateCategoryScores = (answers = {}) => {
  const categoryScores = {};

  Object.values(answers).forEach((answer) => {
    if (!categoryScores[answer.category]) {
      categoryScores[answer.category] = [];
    }
    categoryScores[answer.category].push(Number(answer.value));
  });

  const averages = {};
  Object.keys(categoryScores).forEach((category) => {
    const scores = categoryScores[category];
    averages[category] = Number((scores.reduce((acc, value) => acc + value, 0) / scores.length).toFixed(2));
  });

  return averages;
};

const buildCareerSignals = (results = {}) => {
  const signals = CAREER_CATEGORIES.reduce((acc, category) => ({ ...acc, [category]: 0 }), {});

  const applyScoresToSignals = (scoreMap, sourceType) => {
    Object.entries(scoreMap).forEach(([sourceCategory, score]) => {
      const categoryWeights = categoryWeightMap[sourceType]?.[sourceCategory] || {};
      Object.entries(categoryWeights).forEach(([careerCategory, weight]) => {
        signals[careerCategory] += score * weight;
      });
    });
  };

  if (results.skills?.answers) {
    applyScoresToSignals(calculateCategoryScores(results.skills.answers), 'skills');
  }

  if (results.interest?.answers) {
    applyScoresToSignals(calculateCategoryScores(results.interest.answers), 'interest');
  }

  if (results.personality?.answers) {
    applyScoresToSignals(calculateCategoryScores(results.personality.answers), 'personality');
  }

  return signals;
};

const calculateSkillStrength = (results = {}) => {
  const skillsScores = results.skills?.answers ? Object.values(results.skills.answers) : [];
  if (!skillsScores.length) {
    return 0;
  }

  const average = skillsScores.reduce((acc, answer) => acc + Number(answer.value), 0) / skillsScores.length;
  return (average / 5) * 100;
};

const getTopMatchedReasons = (career, signals, score) => {
  const reasons = [];

  if (signals[career.category] >= 2.5) {
    reasons.push(`Strong alignment with your ${career.category} profile`);
  }

  if (score >= 80) {
    reasons.push('Excellent overall fit based on your assessments');
  } else if (score >= 65) {
    reasons.push('Good fit with growth potential');
  }

  if (career.skills?.length) {
    reasons.push(`Key skills: ${career.skills.slice(0, 2).join(', ')}`);
  }

  return reasons.slice(0, 3);
};

export const getRecommendedCareers = (results = {}, careers = [], limit = 8) => {
  if (!Array.isArray(careers) || !careers.length) {
    return [];
  }

  const hasAssessments = Boolean(results.personality || results.skills || results.interest);
  if (!hasAssessments) {
    return careers
      .slice(0, limit)
      .map((career) => ({ ...career, fitScore: 55, reasons: ['Complete assessments for personalized matching'] }));
  }

  const signals = buildCareerSignals(results);
  const skillStrength = calculateSkillStrength(results);

  const scored = careers.map((career) => {
    const categorySignal = signals[career.category] || 0;
    const categoryScore = Math.min(100, (categorySignal / 5) * 20);
    const salaryBoost = Math.min(8, parseSalaryMin(career.salary) / 2);
    const finalScore = normalizeScore(categoryScore * 0.82 + skillStrength * 0.12 + salaryBoost * 0.06);

    return {
      ...career,
      fitScore: finalScore,
      reasons: getTopMatchedReasons(career, signals, finalScore)
    };
  });

  return scored.sort((a, b) => b.fitScore - a.fitScore).slice(0, limit);
};

export const sortCareers = (careerList = [], sortBy = 'match') => {
  const sorted = [...careerList];

  if (sortBy === 'salary') {
    return sorted.sort((a, b) => parseSalaryMin(b.salary) - parseSalaryMin(a.salary));
  }

  if (sortBy === 'title') {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sorted.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
};
