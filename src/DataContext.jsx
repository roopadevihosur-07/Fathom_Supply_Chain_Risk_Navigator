import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [concerns, setConcerns] = useState([
    {
      id: 1,
      title: 'Hsinchu supplier vulnerability',
      description: 'Single point of failure in Taiwan semiconductor supply',
      riskLevel: 'high',
      reporter: 'User (John Doe)',
      date: '2026-07-07',
      status: 'open',
    },
  ]);

  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      concernId: 1,
      title: 'Diversify supplier base',
      description: 'Establish relationships with secondary suppliers in South Korea',
      proposedBy: 'Manager (Sarah Smith)',
      date: '2026-07-07',
      status: 'pending',
    },
  ]);

  const [solutions, setSolutions] = useState([
    {
      id: 1,
      concernId: 1,
      title: 'Emergency reroute via secondary logistics partner',
      description: 'Redirect component sourcing through pre-qualified backup supplier',
      cost: 46000,
      timeToResolve: 5,
      coverage: 'Full network',
      recommended: true,
      createdBy: 'Admin',
      status: 'active',
    },
  ]);

  const addConcern = (title, description, riskLevel, reporter) => {
    const newConcern = {
      id: Math.max(...concerns.map(c => c.id), 0) + 1,
      title,
      description,
      riskLevel,
      reporter,
      date: new Date().toISOString().split('T')[0],
      status: 'open',
    };
    setConcerns([...concerns, newConcern]);
    return newConcern;
  };

  const addSuggestion = (concernId, title, description, proposedBy) => {
    const newSuggestion = {
      id: Math.max(...suggestions.map(s => s.id), 0) + 1,
      concernId,
      title,
      description,
      proposedBy,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setSuggestions([...suggestions, newSuggestion]);
    return newSuggestion;
  };

  const addSolution = (concernId, title, description, cost, timeToResolve, coverage, recommended, createdBy) => {
    const newSolution = {
      id: Math.max(...solutions.map(s => s.id), 0) + 1,
      concernId,
      title,
      description,
      cost,
      timeToResolve,
      coverage,
      recommended,
      createdBy,
      status: 'active',
    };
    setSolutions([...solutions, newSolution]);
    return newSolution;
  };

  const updateSolution = (solutionId, updates) => {
    setSolutions(solutions.map(s => s.id === solutionId ? { ...s, ...updates } : s));
  };

  const updateConcern = (concernId, status) => {
    setConcerns(concerns.map(c => c.id === concernId ? { ...c, status } : c));
  };

  const updateSuggestion = (suggestionId, status) => {
    setSuggestions(suggestions.map(s => s.id === suggestionId ? { ...s, status } : s));
  };

  return (
    <DataContext.Provider value={{
      concerns,
      suggestions,
      solutions,
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
