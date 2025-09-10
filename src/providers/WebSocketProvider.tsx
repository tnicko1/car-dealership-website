
"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any | null;
  sendMessage: (message: object) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (session?.user?.id && !ws.current) {
      console.log(`[WebSocketProvider] Session found for user ${session.user.id}. Attempting to connect.`);
      const connect = async () => {
        try {
          console.log('[WebSocketProvider] Fetching token...');
          const res = await fetch('/api/auth/ws-token');
          if (!res.ok) {
            console.error(`[WebSocketProvider] Failed to fetch WebSocket token: ${res.status}`);
            return;
          }
          const { token } = await res.json();
          console.log('[WebSocketProvider] Token received. Connecting...');

          const socket = new WebSocket('ws://localhost:3001', token);
          ws.current = socket;

          socket.onopen = () => {
            console.log(`[WebSocketProvider] WebSocket connected for user ${session.user.id}`);
            setIsConnected(true);
          };

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLastMessage(data);

            if (data.type === 'new_notification' && data.notification) {
              toast.info(data.notification.title, {
                description: data.notification.body,
                action: {
                  label: 'View',
                  onClick: () => {
                    if (data.notification.link) {
                        window.location.href = data.notification.link;
                    }
                  },
                },
              });
            }
          };

          socket.onclose = () => {
            console.log(`[WebSocketProvider] WebSocket disconnected for user ${session.user.id}`);
            setIsConnected(false);
            ws.current = null;
          };

          socket.onerror = (error) => {
            console.error('[WebSocketProvider] WebSocket error:', error);
            socket.close();
          };

        } catch (error) {
          console.error('Error connecting to WebSocket:', error);
        }
      };

      connect();

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [session]);

  const sendMessage = useCallback((message: object) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected.');
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
