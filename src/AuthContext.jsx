import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedAuth = localStorage.getItem('butterbaseAuth');
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          setSession(parsedAuth);

          const appId = import.meta.env.VITE_BUTTERBASE_APP_ID;
          const apiUrl = import.meta.env.VITE_BUTTERBASE_API_URL;

          const profileResponse = await fetch(
            `${apiUrl}/v1/${appId}/profiles?user_id=eq.${parsedAuth.user.id}`,
            {
              headers: {
                Authorization: `Bearer ${parsedAuth.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const profiles = await profileResponse.json();
          const profile = Array.isArray(profiles) ? profiles[0] : profiles;

          setUser({
            id: parsedAuth.user.id,
            email: parsedAuth.user.email,
            role: profile?.role || 'user',
            name: profile?.name || parsedAuth.user.display_name || 'User',
          });
        }
      } catch (err) {
        console.error('Session check error:', err);
        localStorage.removeItem('butterbaseAuth');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const appId = import.meta.env.VITE_BUTTERBASE_APP_ID;
      const apiUrl = import.meta.env.VITE_BUTTERBASE_API_URL;

      console.log('🔐 Login attempt:', { email, appId });
      console.log('📍 Endpoint:', `${apiUrl}/auth/${appId}/login`);

      const response = await fetch(`${apiUrl}/auth/${appId}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      console.log('📊 Response status:', response.status);

      const data = await response.json();
      console.log('📋 Response data:', data);
      console.log('📋 Response keys:', Object.keys(data));
      console.log('📋 Full response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        setError(data.error?.message || data.message || 'Login failed');
        setLoading(false);
        return false;
      }

      if (data?.user) {
        console.log('✅ Login successful!');
        console.log('📌 User ID:', data.user.id);
        console.log('🔑 Access Token:', data.access_token?.substring(0, 20) + '...');
        localStorage.setItem('butterbaseAuth', JSON.stringify(data));
        setSession(data);

        try {
          const appId = import.meta.env.VITE_BUTTERBASE_APP_ID;
          const apiUrl = import.meta.env.VITE_BUTTERBASE_API_URL;

          const profileResponse = await fetch(
            `${apiUrl}/v1/${appId}/profiles?user_id=eq.${data.user.id}`,
            {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const profiles = await profileResponse.json();
          const profile = Array.isArray(profiles) ? profiles[0] : profiles;

          console.log('📋 Profile data:', profile);
          console.log('👤 User role:', profile?.role || 'user (default)');

          setUser({
            id: data.user.id,
            email: data.user.email,
            role: profile?.role || 'user',
            name: profile?.name || data.user.display_name || 'User',
          });
        } catch (profileErr) {
          console.error('❌ Error fetching profile:', profileErr);
          setUser({
            id: data.user.id,
            email: data.user.email,
            role: 'user',
            name: data.user.display_name || 'User',
          });
        }

        setLoading(false);
        return true;
      }

      console.log('⚠️ No user in response');
      setError('No user data returned');
      setLoading(false);
      return false;
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setSession(null);
    setError(null);
    localStorage.removeItem('butterbaseAuth');
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
