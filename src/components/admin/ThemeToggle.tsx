import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.add("admin-light");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.add("admin-light");
      localStorage.setItem("admin-theme", "light");
    } else {
      document.documentElement.classList.remove("admin-light");
      localStorage.setItem("admin-theme", "dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative group admin-rgb-glow"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-admin-gold/0 via-admin-gold/20 to-admin-gold/0 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
