import React, { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/layout";
import { Home } from "@/pages/home";
import { Products } from "@/pages/products";
import { Services } from "@/pages/services";
import { Industries } from "@/pages/industries";
import { Solutions } from "@/pages/solutions";
import { Company } from "@/pages/company";
import { Contact } from "@/pages/contact";
import { Demo } from "@/pages/demo";
import { Privacy } from "@/pages/privacy";
import { Terms } from "@/pages/terms";
import { AdminLogin } from "@/pages/admin-login";
import { AdminDashboard } from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ScrollToHash() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // small delay to allow rendering
    }
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToHash />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/products" component={Products} />
        <Route path="/industries" component={Industries} />
        <Route path="/solutions" component={Solutions} />
        <Route path="/company" component={Company} />
        <Route path="/contact" component={Contact} />
        <Route path="/demo" component={Demo} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;