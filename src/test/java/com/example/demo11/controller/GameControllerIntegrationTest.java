package com.example.demo11.controller;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import java.util.Map;
import static org.assertj.core.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GameControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void submitScore_ShouldReturnOk() {
        Map<String, Object> body = Map.of("player", "Tester", "score", 500);
        ResponseEntity<Map> response = restTemplate.postForEntity("/api/score", body, Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("status", "ok");
    }

    @Test
    void getLeaderboard_ShouldReturnList() {
        ResponseEntity<Object[]> response = restTemplate.getForEntity("/api/leaderboard", Object[].class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }
}