import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { SummaryApi } from '../common';

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        try {
          const res = await fetch(`${SummaryApi.users.get_by_id}${userId}`, {
            headers: { 'token': token }
          });

          if (res.ok) {
            const user = await res.json();

            if (user.data && user.data.isAdmin) {
              setIsAuthorized(true);
            } else {
              setIsAuthorized(false);
            }
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error('Error verifying admin:', error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }

      setIsLoading(false);
    };

    verifyAdmin();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Optionally, show a loading spinner
  }

  return isAuthorized ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
