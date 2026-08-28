/** Direction « Cuisine d’atelier » : une expérience de commande directe et lumineuse. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";

function RootRoute() {
  const [location] = useLocation();
  const productSlug = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("savoro_product") : null;
  if (location === "/" && productSlug) return <ProductPage />;
  return <Home />;
}

function Router() {
  return <Switch><Route path="/" component={RootRoute} /><Route path="/produit/:slug" component={ProductPage} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
