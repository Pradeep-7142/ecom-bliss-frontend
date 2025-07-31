import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from './AuthDialog';

export const AuthDialogTrigger: React.FC = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setAuthDialogOpen(true)}>
        <User className="h-5 w-5 mr-2" />
        Login
      </Button>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};