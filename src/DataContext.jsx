import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { session } = useAuth();
  const [concerns, setConcerns] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token || ''}`,
  });

  const getUrl = (table) => {
    const appId = import.meta.env.VITE_BUTTERBASE_APP_ID;
    const apiUrl = import.meta.env.VITE_BUTTERBASE_API_URL;
    return `${apiUrl}/v1/${appId}/${table}`;
  };

  // Load all data from Butterbase
  useEffect(() => {
    if (!session) {
      setConcerns([]);
      setSuggestions([]);
      setSolutions([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const headers = getHeaders();

        const [concernsRes, suggestionsRes, solutionsRes] = await Promise.all([
          fetch(getUrl('concerns'), { headers }),
          fetch(getUrl('suggestions'), { headers }),
          fetch(getUrl('solutions'), { headers }),
        ]);

        const concernsData = await concernsRes.json();
        const suggestionsData = await suggestionsRes.json();
        const solutionsData = await solutionsRes.json();

        setConcerns(Array.isArray(concernsData) ? concernsData : []);
        setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
        setSolutions(Array.isArray(solutionsData) ? solutionsData : []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session]);

  const addConcern = async (title, description, risk_level, reporter, reporter_id) => {
    try {
      const res = await fetch(getUrl('concerns'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, description, risk_level, reporter, reporter_id, status: 'open' }),
      });
      const data = await res.json();
      const newItem = Array.isArray(data) ? data[0] : data;
      setConcerns([...concerns, newItem]);
      return newItem;
    } catch (error) {
      console.error('Error adding concern:', error);
      return null;
    }
  };

  const addSuggestion = async (concern_id, title, description, proposed_by) => {
    try {
      const res = await fetch(getUrl('suggestions'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ concern_id, title, description, proposed_by, status: 'pending' }),
      });
      const data = await res.json();
      const newItem = Array.isArray(data) ? data[0] : data;
      setSuggestions([...suggestions, newItem]);
      return newItem;
    } catch (error) {
      console.error('Error adding suggestion:', error);
      return null;
    }
  };

  const addSolution = async (concern_id, title, description, cost, time_to_resolve, coverage, recommended, created_by) => {
    try {
      const res = await fetch(getUrl('solutions'), {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ concern_id, title, description, cost, time_to_resolve, coverage, recommended, created_by, status: 'active' }),
      });
      const data = await res.json();
      const newItem = Array.isArray(data) ? data[0] : data;
      setSolutions([...solutions, newItem]);
      return newItem;
    } catch (error) {
      console.error('Error adding solution:', error);
      return null;
    }
  };

  const updateSolution = async (id, updates) => {
    try {
      const res = await fetch(`${getUrl('solutions')}?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      setSolutions(solutions.map(s => s.id === id ? { ...s, ...updates } : s));
      return data;
    } catch (error) {
      console.error('Error updating solution:', error);
      return null;
    }
  };

  const updateConcern = async (id, status) => {
    try {
      const res = await fetch(`${getUrl('concerns')}?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setConcerns(concerns.map(c => c.id === id ? { ...c, status } : c));
      return data;
    } catch (error) {
      console.error('Error updating concern:', error);
      return null;
    }
  };

  const updateSuggestion = async (id, status) => {
    try {
      const res = await fetch(`${getUrl('suggestions')}?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setSuggestions(suggestions.map(s => s.id === id ? { ...s, status } : s));
      return data;
    } catch (error) {
      console.error('Error updating suggestion:', error);
      return null;
    }
  };

  return (
    <DataContext.Provider value={{
      concerns,
      suggestions,
      solutions,
      loading,
      addConcern,
      addSuggestion,
      addSolution,
      updateSolution,
      updateConcern,
      updateSuggestion,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
