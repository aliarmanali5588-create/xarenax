import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Theme = "default" | "cyber" | "dark";

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("default");
  const location = useLocation();

  useEffect(() => {
    const savedTheme = (localStorage.getItem("admin-theme") || "default") as Theme;
    setCurrentTheme(savedTheme);
    
    if (location.pathname.startsWith('/admin')) {
      applyTheme(savedTheme);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      document.documentElement.classList.remove("admin-default", "admin-cyber", "admin-dark");
    }
  }, [location.pathname]);

  const applyTheme = (theme: Theme) => {
    document.documentElement.classList.remove("admin-default", "admin-cyber", "admin-dark");
    document.documentElement.classList.add(`admin-${theme}`);
  };

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("admin-theme", theme);
    applyTheme(theme);
  };

  const themes = [
    { value: "default", label: "💎 Premium", description: "Blue, cyan & gold" },
    { value: "cyber", label: "🌐 Cyberpunk", description: "Neon purple & cyan" },
    { value: "dark", label: "🌙 Midnight", description: "Pure dark mode" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative group"
        >
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => changeTheme(theme.value as Theme)}
            className={`cursor-pointer ${
              currentTheme === theme.value ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{theme.label}</span>
              <span className="text-xs text-muted-foreground">{theme.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
