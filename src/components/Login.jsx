import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const Login = ({ onSuccess, onError }) => {
  return (
    <GoogleOAuthProvider clientId="282621080787-pgfhrp4i9on8k4h926hafj6s3gpqssdd.apps.googleusercontent.com">
      <div className="login-container">
        <h2>Login to Hospital Finder</h2>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
