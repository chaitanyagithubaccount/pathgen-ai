package com.pathgen.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pathgen.api.exception.GeminiServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    /**
     * Calls the Gemini API with the given prompt and returns the raw text response.
     */
    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new GeminiServiceException("Gemini API key is not configured. Set GEMINI_API_KEY environment variable.");
        }

        Map<String, Object> requestBody = buildRequest(prompt);
        String url = apiUrl + "?key=" + apiKey;

        log.debug("Calling Gemini API...");

        try {
            String responseBody = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractTextFromResponse(responseBody);

        } catch (GeminiServiceException e) {
            throw e;
        } catch (WebClientResponseException e) {
            String body = e.getResponseBodyAsString();
            log.error("Gemini API HTTP {} error. Body: {}", e.getStatusCode().value(), body);

            // Extract Gemini's error message from the response body
            String geminiMsg = extractGeminiError(body);
            int status = e.getStatusCode().value();

            if (status == 429) {
                throw new GeminiServiceException(
                    "Rate limit hit: " + geminiMsg + " — Wait 60 seconds and try again.");
            } else if (status == 400) {
                throw new GeminiServiceException("Bad request to Gemini: " + geminiMsg);
            } else if (status == 403) {
                throw new GeminiServiceException("API key invalid or lacks permission: " + geminiMsg);
            } else {
                throw new GeminiServiceException("Gemini API error " + status + ": " + geminiMsg);
            }
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
            throw new GeminiServiceException("Failed to connect to Gemini API: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> buildRequest(String prompt) {
        return Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{
                    Map.of("text", prompt)
                })
            },
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 8192,
                "responseMimeType", "application/json"
            )
        );
    }

    private String extractGeminiError(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode msg = root.path("error").path("message");
            return msg.isMissingNode() ? body : msg.asText();
        } catch (Exception e) {
            return body;
        }
    }

    private String extractTextFromResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");

            if (candidates.isEmpty()) {
                log.error("No candidates in Gemini response: {}", responseBody);
                throw new GeminiServiceException("Gemini returned an empty response. Check your API key and quota.");
            }

            String text = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            if (text == null || text.isBlank()) {
                throw new GeminiServiceException("Gemini returned blank content.");
            }

            return text;
        } catch (GeminiServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new GeminiServiceException("Failed to parse Gemini response: " + e.getMessage(), e);
        }
    }
}
