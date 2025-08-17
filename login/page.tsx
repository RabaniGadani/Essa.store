"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/hooks/use-toast";

const supabase = createClientComponentClient();

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // --- User session state ---
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  // On mount, get session and set user/session state
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      } else {
        setSession(null);
        setUser(null);
      }
    };
    getSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // If the user logs out, redirect to /login
        if (event === "SIGNED_OUT") {
          router.push("/login");
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    // Show loading toast
    toast({
      title: "Signing in...",
      description: "Please wait while we authenticate your account.",
    });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (!data || !data.user) {
      setError("Authentication failed. Please try again.");
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } else {
      setSuccess("Login successful!");
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
      setUser(data.user); // Set user state
      setSession(data.session); // Set session state
      router.push("/");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    // Show loading toast
    toast({
      title: "Creating account...",
      description: "Please wait while we set up your account.",
    });
    
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    if (!registerData.agreeToTerms) {
      setError("You must agree to the terms.");
      toast({
        title: "Terms Agreement Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: {
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          phone: registerData.phone,
        },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSuccess(
        "Registration successful! Check your email to verify your account."
      );
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });
      if (data?.user) setUser(data.user);
      if (data?.session) setSession(data.session);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    // Show loading toast
    toast({
      title: "Sending reset email...",
      description: "Please wait while we send the password reset link.",
    });
    
    // window.location.origin may be undefined in SSR, so check for window
    let redirectTo = "/login";
    if (typeof window !== "undefined") {
      redirectTo = window.location.origin + "/login";
    }
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setForgotSent(true);
      setSuccess("Password reset email sent!");
      toast({
        title: "Reset Email Sent",
        description: "Check your email for the password reset link.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/30 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center group">
            <div className="w-12 h-8 bg-gradient-to-r from-ajrak-indigo to-ajrak-red flex items-center justify-center group-hover:animate-ajrak-pulse transition-all duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logo.jpg"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="ml-2 text-2xl font-bold text-ajrak-indigo group-hover:text-ajrak-red transition-colors">
             Essa.store
            </span>
          </Link>
          <p className="text-gray-600 mt-2">
            Welcome to our traditional fashion store
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-ajrak-cream/30">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-ajrak-indigo data-[state=active]:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-ajrak-indigo data-[state=active]:text-white"
            >
              Sign Up
            </TabsTrigger>
            <TabsTrigger
              value="forgot"
              className="data-[state=active]:bg-ajrak-indigo data-[state=active]:text-white"
            >
              Forgot Password
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo">Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="text-red-600 mb-2 text-sm">{error}</div>
                )}
                {success && (
                  <div className="text-green-600 mb-2 text-sm">{success}</div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowPassword((prev) => !prev);
                          toast({
                            title: "Password Visibility",
                            description: showPassword ? "Password hidden" : "Password visible",
                          });
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ajrak-indigo"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) =>
                          setLoginData({
                            ...loginData,
                            rememberMe: Boolean(checked),
                          })
                        }
                      />
                      <Label
                        htmlFor="remember-me"
                        className="text-sm cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-ajrak-indigo hover:text-ajrak-red"
                      onClick={() => {
                        setShowForgot(true);
                        toast({
                          title: "Password Reset",
                          description: "Switching to password reset form.",
                        });
                        // Switch to forgot tab
                        const forgotTab = document.querySelector('[data-state="forgot"]');
                        if (forgotTab) (forgotTab as HTMLElement).click();
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-ajrak-indigo hover:bg-ajrak-red"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-ajrak-indigo/20 hover:bg-ajrak-cream/30 bg-transparent"
                      onClick={() => {
                        toast({
                          title: "Google Login",
                          description: "Google authentication coming soon!",
                        });
                      }}
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-ajrak-indigo/20 hover:bg-ajrak-cream/30 bg-transparent"
                      onClick={() => {
                        toast({
                          title: "Facebook Login",
                          description: "Facebook authentication coming soon!",
                        });
                      }}
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forgot Password Tab */}
          <TabsContent value="forgot">
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo">
                  Forgot Password
                </CardTitle>
                <CardDescription>
                  Enter your email to receive a password reset link.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="text-red-600 mb-2 text-sm">{error}</div>
                )}
                {success && (
                  <div className="text-green-600 mb-2 text-sm">{success}</div>
                )}
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-ajrak-indigo hover:bg-ajrak-red"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Email"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                      setShowForgot(false);
                      setForgotSent(false);
                      setError("");
                      setSuccess("");
                      toast({
                        title: "Cancelled",
                        description: "Returning to login form.",
                      });
                      // Switch back to login tab
                      const loginTab = document.querySelector('[data-state="login"]');
                      if (loginTab) (loginTab as HTMLElement).click();
                    }}
                  >
                    Cancel
                  </Button>
                  {forgotSent && (
                    <div className="text-green-600 text-sm mt-2">
                      Check your email for a reset link.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo">
                  Create Account
                </CardTitle>
                <CardDescription>
                  Join our community of fashion enthusiasts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="text-red-600 mb-2 text-sm">{error}</div>
                )}
                {success && (
                  <div className="text-green-600 mb-2 text-sm">{success}</div>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="first-name"
                          type="text"
                          placeholder="First name"
                          value={registerData.firstName}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              firstName: e.target.value,
                            })
                          }
                          className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="last-name"
                          type="text"
                          placeholder="Last name"
                          value={registerData.lastName}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              lastName: e.target.value,
                            })
                          }
                          className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            phone: e.target.value,
                          })
                        }
                        className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowPassword((prev) => !prev);
                          toast({
                            title: "Password Visibility",
                            description: showPassword ? "Password hidden" : "Password visible",
                          });
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ajrak-indigo"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowConfirmPassword((prev) => !prev);
                          toast({
                            title: "Confirm Password Visibility",
                            description: showConfirmPassword ? "Confirm password hidden" : "Confirm password visible",
                          });
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ajrak-indigo"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agree-terms"
                      checked={registerData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setRegisterData({
                          ...registerData,
                          agreeToTerms: Boolean(checked),
                        })
                      }
                    />
                    <Label
                      htmlFor="agree-terms"
                      className="text-sm cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-ajrak-indigo hover:text-ajrak-red"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-ajrak-indigo hover:text-ajrak-red"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-ajrak-indigo hover:bg-ajrak-red"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
