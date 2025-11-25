import { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ParticleConfig {
  count: number;
  speed: number;
  colorScheme: "gold-red" | "cyan-magenta" | "rainbow" | "purple-blue" | "green-yellow";
}

const colorSchemes = {
  "gold-red": {
    name: "Gold & Red",
    colors: [
      "rgba(255, 215, 0, 0.6)",
      "rgba(239, 68, 68, 0.6)",
      "rgba(255, 140, 0, 0.6)",
      "rgba(220, 20, 60, 0.6)",
    ],
  },
  "cyan-magenta": {
    name: "Cyan & Magenta",
    colors: [
      "rgba(0, 255, 255, 0.6)",
      "rgba(255, 0, 255, 0.6)",
      "rgba(0, 191, 255, 0.6)",
      "rgba(255, 105, 180, 0.6)",
    ],
  },
  rainbow: {
    name: "Rainbow",
    colors: [
      "rgba(255, 0, 0, 0.6)",
      "rgba(255, 127, 0, 0.6)",
      "rgba(255, 255, 0, 0.6)",
      "rgba(0, 255, 0, 0.6)",
      "rgba(0, 0, 255, 0.6)",
      "rgba(75, 0, 130, 0.6)",
      "rgba(148, 0, 211, 0.6)",
    ],
  },
  "purple-blue": {
    name: "Purple & Blue",
    colors: [
      "rgba(138, 43, 226, 0.6)",
      "rgba(75, 0, 130, 0.6)",
      "rgba(0, 0, 255, 0.6)",
      "rgba(65, 105, 225, 0.6)",
    ],
  },
  "green-yellow": {
    name: "Green & Yellow",
    colors: [
      "rgba(0, 255, 0, 0.6)",
      "rgba(127, 255, 0, 0.6)",
      "rgba(255, 255, 0, 0.6)",
      "rgba(173, 255, 47, 0.6)",
    ],
  },
};

interface ParticleSettingsProps {
  config: ParticleConfig;
  onChange: (config: ParticleConfig) => void;
}

const ParticleSettings = ({ config, onChange }: ParticleSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCountChange = (value: number[]) => {
    onChange({ ...config, count: value[0] });
  };

  const handleSpeedChange = (value: number[]) => {
    onChange({ ...config, speed: value[0] });
  };

  const handleColorSchemeChange = (value: string) => {
    onChange({ ...config, colorScheme: value as ParticleConfig["colorScheme"] });
  };

  return (
    <>
      {/* Floating Settings Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg admin-neon-card admin-glow-gold group"
        size="icon"
      >
        <Settings className="h-6 w-6 text-admin-gold group-hover:rotate-90 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-admin-gold/0 via-admin-gold/20 to-admin-gold/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
      </Button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <Card className="fixed bottom-24 right-6 w-96 z-50 bg-card/95 backdrop-blur-xl border-admin-gold/50 admin-neon-card animate-scale-in shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-gaming bg-gradient-to-r from-admin-gold to-admin-red bg-clip-text text-transparent">
                Particle Settings
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Particle Count */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">
                    Particle Count
                  </Label>
                  <span className="text-sm text-admin-gold font-bold">{config.count}</span>
                </div>
                <Slider
                  value={[config.count]}
                  onValueChange={handleCountChange}
                  min={10}
                  max={150}
                  step={10}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust the number of particles (10-150)
                </p>
              </div>

              {/* Particle Speed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">
                    Speed Multiplier
                  </Label>
                  <span className="text-sm text-admin-gold font-bold">{config.speed.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[config.speed]}
                  onValueChange={handleSpeedChange}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Control particle movement speed (0.1x-3x)
                </p>
              </div>

              {/* Color Scheme */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Color Scheme
                </Label>
                <Select value={config.colorScheme} onValueChange={handleColorSchemeChange}>
                  <SelectTrigger className="bg-card/50 border-admin-gold/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(colorSchemes).map(([key, scheme]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {scheme.colors.slice(0, 4).map((color, i) => (
                              <div
                                key={i}
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span>{scheme.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose your favorite color palette
                </p>
              </div>

              {/* Preview Colors */}
              <div className="pt-3 border-t border-border/50">
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Current Colors Preview
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {colorSchemes[config.colorScheme].colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg border-2 border-border admin-glow-gold"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 15px ${color}`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full border-admin-red/50 hover:bg-admin-red/10"
                onClick={() =>
                  onChange({ count: 50, speed: 1, colorScheme: "gold-red" })
                }
              >
                Reset to Default
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default ParticleSettings;
export { colorSchemes };
