import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userData = urlParams.get('user');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          toast({
            title: "Authentication Error",
            description: "Failed to authenticate with Google. Please try again.",
            variant: "destructive",
          });
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (token && userData) {
          try {
            const user = JSON.parse(decodeURIComponent(userData));
            
            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            
            toast({
              title: "Welcome!",
              description: `Successfully logged in as ${user.name}`,
            });

            // Clean up URL
            window.history.replaceState({}, document.title, '/');
            
            // Redirect to home page
            setTimeout(() => navigate('/'), 2000);
          } catch (error) {
            console.error('Error parsing user data:', error);
            setStatus('error');
            setMessage('Invalid authentication data. Please try again.');
            setTimeout(() => navigate('/'), 3000);
          }
        } else {
          setStatus('error');
          setMessage('Invalid callback parameters. Please try again.');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Authenticating...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we complete your authentication.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Success!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {message}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-12 w-12 text-red-600" />
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Authentication Failed
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {message}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback; 