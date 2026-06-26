import { useEffect, useRef } from 'react';
import { useAdventureStore } from '../stores/useAdventureStore';

const API_URL = 'http://localhost:3001';
const POLL_INTERVAL_MS = 10000;

export function useVideoPolling(taskId: string | null): void {
  const setVictoryImageUrl = useAdventureStore((s) => s.setVictoryImageUrl);
  const setVictoryVideoUrl = useAdventureStore((s) => s.setVictoryVideoUrl);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const poll = async () => {
      try {
        const res = await fetch(`${API_URL}/api/adventure/${taskId}/video-status`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.victoryImageUrl) {
          setVictoryImageUrl(data.victoryImageUrl);
        }

        if (data.videoUrl) {
          setVictoryVideoUrl(data.videoUrl);
          // Stop polling once video is complete
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch {
        // Network errors are non-fatal during battle
      }
    };

    // Poll immediately, then on interval
    void poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [taskId, setVictoryImageUrl, setVictoryVideoUrl]);
}
