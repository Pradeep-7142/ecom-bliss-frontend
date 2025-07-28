import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from './AuthDialog';

export const AuthDialogTrigger: React.FC = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => setAuthDialogOpen(true)}>
          <User className="h-5 w-5 mr-2" />
          Login
        </Button>
        <Button size="sm" onClick={() => setAuthDialogOpen(true)}>
          Sign Up
        </Button>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};