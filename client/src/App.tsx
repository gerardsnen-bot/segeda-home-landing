/**
 * Réplica Segeda Home: enrutamiento mínimo para mantener /catalogo como destino principal.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Category from "./pages/Category";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHistory from "./pages/AdminHistory";
import AdminSeo from "./pages/AdminSeo";
import AdminVisualEditor from "./pages/AdminVisualEditor";
import Home from "./pages/Home";
import Navidad from "./pages/Navidad";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalogo" component={Home} />
      <Route path="/catalogo/navidad" component={Navidad} />
      <Route path="/catalogo/:category" component={Category} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/historial" component={AdminHistory} />
      <Route path="/admin/editor" component={AdminVisualEditor} />
      <Route path="/admin/seo" component={AdminSeo} />
      <Route path="/admin/:section" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
