package com.example.demo11.controller;

import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api")
public class GameController {

    // 存储排行榜记录 (player, score)
    private final List<Map<String, Object>> leaderboard = new CopyOnWriteArrayList<>();

    @PostMapping("/score")
    public Map<String, String> submitScore(@RequestBody Map<String, Object> payload) {
        String player = (String) payload.getOrDefault("player", "匿名");
        int score = ((Number) payload.getOrDefault("score", 0)).intValue();

        Map<String, Object> entry = new HashMap<>();
        entry.put("player", player);
        entry.put("score", score);
        leaderboard.add(entry);

        // 按分数降序排序，保留前10
        leaderboard.sort((a, b) -> ((Integer) b.get("score")).compareTo((Integer) a.get("score")));
        return Map.of("status", "ok");
    }

    @GetMapping("/leaderboard")
    public List<Map<String, Object>> getLeaderboard() {
        if (leaderboard.size() > 10) {
            return leaderboard.subList(0, 10);
        }
        return leaderboard;
    }
}