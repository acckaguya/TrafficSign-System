import { useEffect, useRef, useState } from 'react';

export const useTelemetrySocket = (onDataReceived) => {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // 忙碌状态锁
  const isBusyRef = useRef(false);

  useEffect(() => {
    let reconnectInterval;
    
    const connect = () => {
        try {
            wsRef.current = new WebSocket('ws://localhost:8000/ws');

            wsRef.current.onopen = () => {
                console.log("WS Connected");
                setIsConnected(true);
                isBusyRef.current = false; // 连接成功重置状态
                if(reconnectInterval) clearInterval(reconnectInterval);
            };
            
            wsRef.current.onclose = () => {
                console.log("WS Disconnected");
                setIsConnected(false);
                reconnectInterval = setInterval(() => {
                    if(wsRef.current?.readyState === WebSocket.CLOSED) connect();
                }, 3000);
            };
            
            wsRef.current.onmessage = (event) => {
              // 后端处理完了，解锁
              isBusyRef.current = false; 
              
              try {
                const data = JSON.parse(event.data);
                if (data.status === 'ok' && onDataReceived) {
                  onDataReceived(data);
                }
              } catch (e) {
                console.error("WS Parse Error", e);
              }
            };
        } catch (e) {
            console.error("WS Connection Error", e);
        }
    };

    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectInterval) clearInterval(reconnectInterval);
    };
  }, []);

  const sendTelemetry = (imageData, speed) => {
    // 确保视频流不会产生累积延迟
    if (isBusyRef.current) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      isBusyRef.current = true; // 标记为忙碌
      wsRef.current.send(JSON.stringify({
        image: imageData,
        speed: speed
      }));
    }
  };

  return { isConnected, sendTelemetry };
};