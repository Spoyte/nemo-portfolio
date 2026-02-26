"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Trash2,
  Copy,
  Sparkles,
  History,
  Settings,
  Languages,
  Binary,
  Music,
  Type,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Morse code mapping
const morseCode: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", 1: ".----", 2: "..---", 3: "...--",
  4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..",
  9: "----.", 0: "-----", " ": "/", ".": ".-.-.-", ",": "--..--",
  "?": "..--..", "!": "-.-.--", "'": ".----.", "(": "-.--.",
  ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.",
  "=": "-...-", "+": ".-.-.", "-": "-....-", _: "..--.-",
  '"': ".-..-.", $: "...-..-", "@": ".--.-.", "/": "-..-.",
};

const reverseMorse: Record<string, string> = Object.entries(morseCode).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

// Binary/ASCII converter
const textToBinary = (text: string) =>
  text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");

const binaryToText = (binary: string) => {
  try {
    return binary
      .split(" ")
      .map((bin) => String.fromCharCode(parseInt(bin, 2)))
      .join("");
  } catch {
    return "Invalid binary";
  }
};

// Hex converter
const textToHex = (text: string) =>
  text
    .split("")
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");

const hexToText = (hex: string) => {
  try {
    return hex
      .split(" ")
      .map((h) => String.fromCharCode(parseInt(h, 16)))
      .join("");
  } catch {
    return "Invalid hex";
  }
};

// Base64 converter
const textToBase64 = (text: string) => {
  try {
    return btoa(text);
  } catch {
    return "Invalid input";
  }
};

const base64ToText = (base64: string) => {
  try {
    return atob(base64);
  } catch {
    return "Invalid base64";
  }
};

type ConverterType = "morse" | "binary" | "hex" | "base64";

interface ConversionHistory {
  id: string;
  type: ConverterType;
  input: string;
  output: string;
  timestamp: number;
}

export function SecretEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [converterType, setConverterType] = useState<ConverterType>("morse");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }

    let result = "";

    switch (converterType) {
      case "morse":
        if (mode === "encode") {
          result = input
            .toUpperCase()
            .split("")
            .map((char) => morseCode[char] || char)
            .join(" ");
        } else {
          result = input
            .split(" ")
            .map((code) => reverseMorse[code] || code)
            .join("");
        }
        break;

      case "binary":
        result = mode === "encode" ? textToBinary(input) : binaryToText(input);
        break;

      case "hex":
        result = mode === "encode" ? textToHex(input) : hexToText(input);
        break;

      case "base64":
        result = mode === "encode" ? textToBase64(input) : base64ToText(input);
        break;
    }

    setOutput(result);

    // Add to history
    if (result && result !== "Invalid binary" && result !== "Invalid hex" && result !== "Invalid base64") {
      const newEntry: ConversionHistory = {
        id: Date.now().toString(),
        type: converterType,
        input: input.slice(0, 50),
        output: result.slice(0, 50),
        timestamp: Date.now(),
      };
      setHistory((prev) => [newEntry, ...prev].slice(0, 20));
    }
  }, [input, converterType, mode]);

  useEffect(() => {
    convert();
  }, [convert]);

  const playMorseSound = (morse: string) => {
    if (!soundEnabled || converterType !== "morse") return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const dotDuration = 100;
    const dashDuration = dotDuration * 3;
    const pauseDuration = dotDuration;
    const letterPause = dotDuration * 3;

    let currentTime = audioContext.currentTime;

    morse.split("").forEach((char) => {
      if (char === "." || char === "-") {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.1;

        const duration = char === "." ? dotDuration : dashDuration;

        oscillator.start(currentTime);
        oscillator.stop(currentTime + duration / 1000);

        currentTime += duration / 1000 + pauseDuration / 1000;
      } else if (char === " ") {
        currentTime += letterPause / 1000;
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  const converterIcons = {
    morse: <Type className="h-4 w-4" />,
    binary: <Binary className="h-4 w-4" />,
    hex: <Settings className="h-4 w-4" />,
    base64: <Languages className="h-4 w-4" />,
  };

  return (
    <div className="space-y-6">
      {/* Converter Type Selection */}
      <div className="flex flex-wrap gap-2">
        {(["morse", "binary", "hex", "base64"] as ConverterType[]).map((type) => (
          <Button
            key={type}
            variant={converterType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setConverterType(type)}
            className="gap-2"
          >
            {converterIcons[type]}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === "encode" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("encode")}
        >
          Encode
        </Button>
        <Button
          variant={mode === "decode" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("decode")}
        >
          Decode
        </Button>
      </div>

      {/* Input/Output Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {mode === "encode" ? "Text" : converterType.charAt(0).toUpperCase() + converterType.slice(1)}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(input)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={clearAll}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : `Enter ${converterType} to decode...`
              }
              className="w-full h-40 p-4 font-mono text-sm bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {mode === "encode" ? converterType.charAt(0).toUpperCase() + converterType.slice(1) : "Text"}
              </CardTitle>
              <div className="flex gap-1">
                {converterType === "morse" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => playMorseSound(output)}
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(output)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-40 p-4 font-mono text-sm bg-muted rounded-lg resize-none focus:outline-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Morse Code Reference */}
      {converterType === "morse" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Morse Code Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 md:grid-cols-9 gap-2 text-center text-sm">
              {Object.entries(morseCode)
                .slice(0, 36)
                .map(([char, code]) => (
                  <div
                    key={char}
                    className="p-2 bg-muted rounded hover:bg-primary/10 transition-colors cursor-pointer"
                    onClick={() => {
                      setInput((prev) => prev + char);
                      playMorseSound(code);
                    }}
                  >
                    <span className="font-bold">{char}</span>
                    <br />
                    <span className="text-muted-foreground font-mono">{code}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="h-4 w-4 mr-2" />
          {showHistory ? "Hide" : "Show"} History ({history.length})
        </Button>

        {converterType === "morse" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                Sound On
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 mr-2" />
                Sound Off
              </>
            )}
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {history.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{entry.type}</Badge>
                      <span className="text-sm truncate max-w-[200px]">{entry.input}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInput(entry.input);
                        setConverterType(entry.type);
                      }}
                    >
                      Restore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
