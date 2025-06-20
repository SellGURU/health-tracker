import { Switch, Route } from "wouter";
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
import MobileLayout from "@/components/layout/mobile-layout";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <MobileLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/upload" component={LabUpload} />
        <Route path="/manual-entry" component={ManualEntry} />
        <Route path="/trends" component={Trends} />
        <Route path="/action-plans" component={ActionPlans} />
        <Route path="/holistic-plans" component={HolisticPlans} />
        <Route path="/profile" component={Profile} />
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
