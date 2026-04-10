package com.example.demo11.handler;

import org.springframework.web.socket.*;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

public class GameWebSocketHandler implements WebSocketHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.put(session.getId(), session);
        System.out.println("连接建立: " + session.getId());
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws IOException {
        String payload = message.getPayload().toString();
        System.out.println("收到消息: " + payload);
        // 广播给所有客户端
        for (WebSocketSession s : sessions.values()) {
            if (s.isOpen()) {
                s.sendMessage(new TextMessage(payload));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
        System.out.println("连接关闭: " + session.getId());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        System.err.println("传输错误: " + exception.getMessage());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}