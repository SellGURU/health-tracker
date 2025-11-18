import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import LabUpload from "@/pages/lab-upload";
import ManualEntry from "@/pages/manual-entry";
import Trends from "@/pages/trends";
import ActionPlans from "@/pages/action-plans";
import HolisticPlans from "@/pages/holistic-plans";
import Profile from "@/pages/profile";
import Onboarding from "@/pages/onboarding";
import YouMenu from "@/pages/you-menu";
import ChatPage from "@/pages/chat";
import EducationalPage from "@/pages/educational";
import PlanPage from "@/pages/plan-simple";
import ActionPlanPage from "@/pages/action-plan";
import MobileLayout from "@/components/layout/mobile-layout";
import NotFound from "@/pages/not-found";
// import { usePushNotifications } from "./hooks/use-pushNotification";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import { useToast } from "@/hooks/use-toast";

function Router() {
  const { isAuthenticated, fetchClientInformation, needsPasswordChange } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isOnboardingCompleted =
    localStorage.getItem("onboardingCompleted") === "true";
  // const { token, notifications } = usePushNotifications();
  // useEffect(() => {
  //   alert(notifications[notifications.length -1].title)
  // },[notifications])

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // اینجا مطمئن میشیم اپ روی موبایل ران شده
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.setBackgroundColor({ color: "#ffffff" });
    }
  }, []);

  // Check password change requirement after login
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔍 Checking password change requirement...');
      fetchClientInformation().then(() => {
        const needsChange = needsPasswordChange();
        console.log('🔍 Needs password change:', needsChange);
        
        if (needsChange) {
          console.log('🔍 Redirecting to profile page...');
          // Store flag to open password dialog
          localStorage.setItem("requirePasswordChange", "true");
          
          // Redirect to profile page
          setLocation("/profile");
          
          // Show toast notification
          toast({
            title: "Password Change Required",
            description: "For security reasons, please change your password before continuing.",
            variant: "destructive",
          });
        }
      });
    }
  }, [isAuthenticated, fetchClientInformation, needsPasswordChange, setLocation, toast]);

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={AuthPage} />
        <Route component={AuthPage} />
      </Switch>
    );
  }

  return (
    <MobileLayout>
      <Switch>
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/" component={YouMenu} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/monitor" component={Trends} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/educational" component={EducationalPage} />
        <Route path="/profile" component={Profile} />
        <Route path="/plan" component={PlanPage} />
        <Route path="/action-plan" component={ActionPlanPage} />
        <Route path="/lab-upload" component={LabUpload} />
        <Route path="/manual-entry" component={ManualEntry} />
        <Route path="/holistic-plans" component={HolisticPlans} />
        <Route path="/not-found" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="mobile-container">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
