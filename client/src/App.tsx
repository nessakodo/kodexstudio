import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Switch>
        <Route path="/kodexstudio/">
          <Home />
        </Route>
        <Route path="/kodexstudio/:rest*">
          <NotFound />
        </Route>
      </Switch>
    </TooltipProvider>
  );
}

export default App;
