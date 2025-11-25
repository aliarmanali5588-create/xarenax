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
  colorScheme: "gold-red" | "cyan-magenta" | "rainbow" | "purple-blue" | "green-yellow" | "neon-pink" | "ocean-deep" | "sunset-glow";
  enabled: boolean;
  particleSize: number;
  connectionDistance: number;
}

const colorSchemes = {
  "gold-red": {
    name: "Gold & Red",
    colors: [
      "rgba(255, 215, 0, 0.15)",
      "rgba(239, 68, 68, 0.15)",
      "rgba(255, 140, 0, 0.12)",
      "rgba(220, 20, 60, 0.12)",
    ],
  },
  "cyan-magenta": {
    name: "Cyan & Magenta",
    colors: [
      "rgba(0, 255, 255, 0.15)",
      "rgba(255, 0, 255, 0.15)",
      "rgba(0, 191, 255, 0.12)",
      "rgba(255, 105, 180, 0.12)",
    ],
  },
  rainbow: {
    name: "Rainbow",
    colors: [
      "rgba(255, 0, 0, 0.15)",
      "rgba(255, 127, 0, 0.12)",
      "rgba(255, 255, 0, 0.12)",
      "rgba(0, 255, 0, 0.12)",
      "rgba(0, 0, 255, 0.15)",
      "rgba(75, 0, 130, 0.12)",
      "rgba(148, 0, 211, 0.12)",
    ],
  },
  "purple-blue": {
    name: "Purple & Blue",
    colors: [
      "rgba(138, 43, 226, 0.15)",
      "rgba(75, 0, 130, 0.12)",
      "rgba(0, 0, 255, 0.12)",
      "rgba(65, 105, 225, 0.15)",
    ],
  },
  "green-yellow": {
    name: "Green & Yellow",
    colors: [
      "rgba(0, 255, 0, 0.12)",
      "rgba(127, 255, 0, 0.12)",
      "rgba(255, 255, 0, 0.15)",
      "rgba(173, 255, 47, 0.12)",
    ],
  },
  "neon-pink": {
    name: "Neon Pink",
    colors: [
      "rgba(255, 20, 147, 0.15)",
      "rgba(255, 105, 180, 0.12)",
      "rgba(255, 0, 127, 0.15)",
      "rgba(219, 112, 147, 0.12)",
    ],
  },
  "ocean-deep": {
    name: "Ocean Deep",
    colors: [
      "rgba(0, 105, 148, 0.15)",
      "rgba(0, 191, 255, 0.12)",
      "rgba(30, 144, 255, 0.12)",
      "rgba(0, 150, 199, 0.15)",
    ],
  },
  "sunset-glow": {
    name: "Sunset Glow",
    colors: [
      "rgba(255, 94, 77, 0.15)",
      "rgba(255, 140, 0, 0.12)",
      "rgba(255, 69, 0, 0.15)",
      "rgba(255, 99, 71, 0.12)",
    ],
  },
};

interface ParticleSettingsProps {
  config: ParticleConfig;
  onChange: (config: ParticleConfig) => void;
}

const presets = {
  minimal: {
    name: "Minimal",
    icon: "✨",
    description: "Subtle & clean",
    config: { count: 15, speed: 0.3, colorScheme: "gold-red" as const, enabled: true, particleSize: 2, connectionDistance: 100 },
  },
  balanced: {
    name: "Balanced",
    icon: "🎯",
    description: "Perfect balance",
    config: { count: 30, speed: 0.5, colorScheme: "gold-red" as const, enabled: true, particleSize: 2.5, connectionDistance: 120 },
  },
  dynamic: {
    name: "Dynamic",
    icon: "⚡",
    description: "Lively & energetic",
    config: { count: 60, speed: 1, colorScheme: "rainbow" as const, enabled: true, particleSize: 3, connectionDistance: 150 },
  },
};

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

  const handleToggleParticles = () => {
    onChange({ ...config, enabled: !config.enabled });
  };

  const handleParticleSizeChange = (value: number[]) => {
    onChange({ ...config, particleSize: value[0] });
  };

  const handleConnectionDistanceChange = (value: number[]) => {
    onChange({ ...config, connectionDistance: value[0] });
  };

  const applyPreset = (presetKey: keyof typeof presets) => {
    onChange(presets[presetKey].config);
  };

  return (
    <>
      {/* Floating Settings Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-md bg-card/90 backdrop-blur border border-border hover:border-admin-gold/30 transition-all group"
        size="icon"
      >
        <Settings className="h-5 w-5 text-muted-foreground group-hover:text-admin-gold group-hover:rotate-90 transition-all duration-300" />
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
          <Card className="fixed bottom-20 right-6 w-96 max-h-[80vh] overflow-y-auto z-50 bg-card/95 backdrop-blur-xl border border-border/50 animate-scale-in shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                Background Effects
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
              {/* Enable/Disable Particles */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <Label className="text-sm font-semibold text-foreground">
                    Background Particles
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {config.enabled ? "Animations active" : "Animations disabled"}
                  </p>
                </div>
                <Button
                  variant={config.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleParticles}
                  className="min-w-[80px]"
                >
                  {config.enabled ? "ON" : "OFF"}
                </Button>
              </div>

              {config.enabled && (
                <>
                  {/* Presets */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">
                      Quick Presets
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => {
                        const preset = presets[key];
                        const isActive = 
                          config.count === preset.config.count &&
                          config.speed === preset.config.speed &&
                          config.colorScheme === preset.config.colorScheme;
                        
                        return (
                          <Button
                            key={key}
                            variant={isActive ? "default" : "outline"}
                            className={`h-auto py-3 px-2 flex flex-col items-center gap-1 transition-all ${
                              isActive ? "ring-2 ring-admin-gold/50" : "hover:border-admin-gold/30"
                            }`}
                            onClick={() => applyPreset(key)}
                          >
                            <span className="text-2xl">{preset.icon}</span>
                            <span className="text-xs font-semibold">{preset.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {preset.description}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click a preset to quickly switch animation styles
                    </p>
                  </div>

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

              {/* Particle Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">
                    Particle Size
                  </Label>
                  <span className="text-sm text-admin-gold font-bold">{config.particleSize.toFixed(1)}px</span>
                </div>
                <Slider
                  value={[config.particleSize]}
                  onValueChange={handleParticleSizeChange}
                  min={1}
                  max={5}
                  step={0.5}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust individual particle size (1px-5px)
                </p>
              </div>

              {/* Connection Distance */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">
                    Connection Distance
                  </Label>
                  <span className="text-sm text-admin-gold font-bold">{config.connectionDistance}px</span>
                </div>
                <Slider
                  value={[config.connectionDistance]}
                  onValueChange={handleConnectionDistanceChange}
                  min={50}
                  max={200}
                  step={10}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  How far particles connect to each other (50px-200px)
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
                  Active Color Palette
                </Label>
                <div className="flex gap-2 flex-wrap p-3 bg-muted/20 rounded-lg">
                  {colorSchemes[config.colorScheme].colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-lg border-2 border-border shadow-sm transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}`,
                      }}
                    />
                  ))}
                </div>
              </div>
              </>
              )}

              {/* Info Box */}
              <div className="p-3 bg-admin-gold/5 border border-admin-gold/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-admin-gold">Tip:</span> {config.enabled ? "Use presets for quick changes, or customize settings above for fine-tuned control." : "Enable particles to access animation controls."}
                </p>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  onChange({ count: 30, speed: 0.5, colorScheme: "gold-red", enabled: true, particleSize: 2.5, connectionDistance: 120 })
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
