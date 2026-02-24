"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "nemo-art-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(new Set(parsed));
      }
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)));
      } catch (err) {
        console.error("Failed to save favorites:", err);
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((key: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (key: string) => favorites.has(key),
    [favorites]
  );

  const addFavorite = useCallback((key: string) => {
    setFavorites((prev) => new Set(prev).add(key));
  }, []);

  const removeFavorite = useCallback((key: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
  }, []);

  return {
    favorites: Array.from(favorites),
    favoritesSet: favorites,
    isLoaded,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    count: favorites.size,
  };
}
