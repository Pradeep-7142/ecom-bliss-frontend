import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Chrome, Facebook, Twitter, ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
  district: z.string().min(2, 'District is required'),
  state: z.string().min(2, 'State is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange }) => {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempSignupData, setTempSignupData] = useState<any>(null);
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values.email, values.password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      // Simulate sending OTP
      setTempSignupData(values);
      setShowOTP(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP",
        variant: "destructive",
      });
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate OTP verification (in real app, verify with backend)
      if (otp === '123456') {
        await signup(tempSignupData.email, tempSignupData.password, tempSignupData.name);
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        onOpenChange(false);
        setShowOTP(false);
        setOtp('');
        setTempSignupData(null);
        setIsSignupMode(false);
      } else {
        toast({
          title: "Error",
          description: "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP",
        variant: "destructive",
      });
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming Soon",
      description: `${provider} login will be implemented soon`,
    });
  };

  const resetForm = () => {
    setIsSignupMode(false);
    setShowOTP(false);
    setOtp('');
    setTempSignupData(null);
    loginForm.reset();
    signupForm.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {showOTP ? 'Verify Your Phone' : (isSignupMode ? 'Create Account' : 'Welcome Back')}
          </DialogTitle>
          <DialogDescription>
            {showOTP 
              ? `Enter the 6-digit code sent to ${tempSignupData?.mobile}`
              : (isSignupMode 
                ? 'Create a new account to get started'
                : 'Sign in to your account or create a new one')
            }
          </DialogDescription>
        </DialogHeader>

        {showOTP ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-3">
              <Button onClick={verifyOTP} className="w-full">
                Verify OTP
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowOTP(false)}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Signup
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!isSignupMode ? (
              // Login Form
              <>
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full"
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="w-full"
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    Continue with Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('Twitter')}
                    className="w-full"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Continue with Twitter
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                {/* Email Login Form */}
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...loginForm.register('email')}
                      className="mt-1"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register('password')}
                      className="mt-1"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Sign In with Email
                  </Button>
                </form>

                {/* Switch to Signup */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignupMode(true)}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </>
            ) : (
              // Signup Form
              <>
                <div className="flex items-center mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSignupMode(false)}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Back to Login</span>
                </div>

                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...signupForm.register('name')}
                        className="mt-1"
                      />
                      {signupForm.formState.errors.name && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        {...signupForm.register('mobile')}
                        className="mt-1"
                      />
                      {signupForm.formState.errors.mobile && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.mobile.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      {...signupForm.register('email')}
                      className="mt-1"
                    />
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {signupForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        {...signupForm.register('password')}
                        className="mt-1"
                      />
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        {...signupForm.register('confirmPassword')}
                        className="mt-1"
                      />
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...signupForm.register('address')}
                      className="mt-1"
                    />
                    {signupForm.formState.errors.address && (
                      <p className="text-sm text-destructive mt-1">
                        {signupForm.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        {...signupForm.register('pincode')}
                        className="mt-1"
                      />
                      {signupForm.formState.errors.pincode && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.pincode.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        {...signupForm.register('district')}
                        className="mt-1"
                      />
                      {signupForm.formState.errors.district && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.district.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select onValueChange={(value) => signupForm.setValue('state', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="up">Uttar Pradesh</SelectItem>
                          <SelectItem value="wb">West Bengal</SelectItem>
                          <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        </SelectContent>
                      </Select>
                      {signupForm.formState.errors.state && (
                        <p className="text-sm text-destructive mt-1">
                          {signupForm.formState.errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Create Account & Verify Mobile
                  </Button>
                </form>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};