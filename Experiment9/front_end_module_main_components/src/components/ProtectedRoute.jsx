import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        // User is not authenticated, redirect to login page
        return <Navigate to="/login" />;
    }

    // User is authenticated, render the children components
    return children;
};

export default ProtectedRoute;