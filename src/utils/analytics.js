const ANALYTICS_KEY = 'usageAnalytics';
const MAX_EVENTS = 800;

const getStoredAnalytics = () => {
  try {
    return JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{"events": []}');
  } catch {
    return { events: [] };
  }
};

const saveAnalytics = (analyticsData) => {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analyticsData));
};

const getCurrentUserEmail = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    return currentUser?.email || 'guest';
  } catch {
    return 'guest';
  }
};

export const trackEvent = (eventType, metadata = {}) => {
  const analyticsData = getStoredAnalytics();
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: eventType,
    timestamp: new Date().toISOString(),
    userEmail: metadata.userEmail || getCurrentUserEmail(),
    ...metadata
  };

  const updatedEvents = [event, ...(analyticsData.events || [])].slice(0, MAX_EVENTS);
  saveAnalytics({ events: updatedEvents });
};

export const clearAnalytics = () => {
  localStorage.removeItem(ANALYTICS_KEY);
};

export const getUsageAnalyticsSummary = () => {
  const analyticsData = getStoredAnalytics();
  const events = analyticsData.events || [];
  const today = new Date().toISOString().split('T')[0];
  const isToday = (timestamp) => timestamp?.startsWith(today);

  const todayEvents = events.filter((event) => isToday(event.timestamp));
  const pageViewsToday = todayEvents.filter((event) => event.type === 'page_view').length;
  const signInsToday = todayEvents.filter((event) => event.type === 'sign_in_success' || event.type === 'admin_sign_in_success').length;
  const assessmentsCompletedToday = todayEvents.filter((event) => event.type === 'assessment_completed').length;

  const activeUsersToday = new Set(
    todayEvents
      .map((event) => event.userEmail)
      .filter((email) => email && email !== 'guest')
  ).size;

  const pageCounts = {};
  const assessmentCounts = {};

  events.forEach((event) => {
    if (event.type === 'page_view' && event.path) {
      pageCounts[event.path] = (pageCounts[event.path] || 0) + 1;
    }
    if (event.type === 'assessment_completed' && event.assessmentType) {
      assessmentCounts[event.assessmentType] = (assessmentCounts[event.assessmentType] || 0) + 1;
    }
  });

  const getTopItem = (countsObject, fallback = 'N/A') => {
    const entries = Object.entries(countsObject);
    if (!entries.length) {
      return fallback;
    }
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  };

  const totalAssessmentCompletions = events.filter((event) => event.type === 'assessment_completed').length;

  return {
    totalEvents: events.length,
    recentEvents: events.slice(0, 8),
    pageViewsToday,
    signInsToday,
    assessmentsCompletedToday,
    activeUsersToday,
    topPage: getTopItem(pageCounts),
    topAssessment: getTopItem(assessmentCounts),
    totalAssessmentCompletions
  };
};
