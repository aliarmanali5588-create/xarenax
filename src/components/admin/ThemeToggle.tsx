import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type Theme = "dark" | "rgb-neon" | "gaming" | "sunset";

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = (localStorage.getItem("admin-theme") || "dark") as Theme;
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: Theme) => {
    // Remove all theme classes
    document.documentElement.classList.remove("admin-rgb-neon", "admin-gaming", "admin-sunset");
    
    // Apply new theme class (except for dark which is default)
    if (theme !== "dark") {
      document.documentElement.classList.add(`admin-${theme}`);
    }
  };

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("admin-theme", theme);
    applyTheme(theme);
  };

  const themes = [
    { value: "dark", label: "🌙 Dark", description: "Default dark theme" },
    { value: "rgb-neon", label: "🌈 RGB Neon", description: "Multi-color glow effects" },
    { value: "gaming", label: "🎮 Gaming", description: "Neon cyberpunk vibes" },
    { value: "sunset", label: "🌅 Sunset", description: "Warm purple & orange" },
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
              currentTheme === theme.value ? "bg-admin-primary/10 text-admin-primary" : ""
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
