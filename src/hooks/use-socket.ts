'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

export function useLiveSocket(matchId: string | undefined, onScoreUpdate?: (data: any) => void) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!matchId) return;

    const socketInstance = io(WS_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      socketInstance.emit('join_match', matchId);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('score.updated', (data) => {
      if (onScoreUpdate) {
        onScoreUpdate(data);
      }
    });

    socketInstance.on('match.started', (data) => {
      if (onScoreUpdate) {
        onScoreUpdate(data);
      }
    });

    socketInstance.on('match.completed', (data) => {
      if (onScoreUpdate) {
        onScoreUpdate(data);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.emit('leave_match', matchId);
      socketInstance.disconnect();
    };
  }, [matchId]);

  return { socket, isConnected };
}
