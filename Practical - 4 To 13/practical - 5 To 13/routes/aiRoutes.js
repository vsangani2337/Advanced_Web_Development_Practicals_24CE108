import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate-description", requireAuth, async (request, response) => {
  try {
    const title = typeof request.body?.title === "string"
      ? request.body.title.trim().slice(0, 120)
      : "";

    if (!title) {
      return response.status(400).json({ message: "A task title is required." });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log("[ai] Neither ANTHROPIC_API_KEY nor OPENAI_API_KEY is configured. Returning 502 for client fallback.");
      return response.status(502).json({ message: "AI service is unavailable." });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      const providerResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
          max_tokens: 200,
          temperature: 1,
          system: "You write short, practical task descriptions for a to-do app. Reply with the description only: no quotes, no markdown, no preface. Write 1 to 2 sentences, under 250 characters. Be specific to the task topic (mention real steps, tools or concerns).",
          messages: [
            {
              role: "user",
              content: `Task title: ${title}\nWrite the description.`,
            },
          ],
        }),
      });

      const responseBody = await providerResponse.text();
      if (!providerResponse.ok) {
        console.error("[ai] Anthropic request failed", {
          status: providerResponse.status,
          body: responseBody,
        });
        return response.status(502).json({ message: "AI service is unavailable." });
      }

      let data;
      try {
        data = JSON.parse(responseBody);
      } catch (err) {
        return response.status(502).json({ message: "AI service returned an invalid response." });
      }

      const description = Array.isArray(data.content)
        ? data.content
            .filter((block) => block?.type === "text" && typeof block.text === "string")
            .map((block) => block.text)
            .join("")
            .trim()
            .slice(0, 300)
        : "";

      if (!description) {
        return response.status(502).json({ message: "AI service returned an empty description." });
      }

      return response.status(200).json({ description });
    }

    // OpenAI fallback if OPENAI_API_KEY is provided
    if (process.env.OPENAI_API_KEY) {
      const providerResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          max_tokens: 150,
          messages: [
            {
              role: "system",
              content: "You write short, practical task descriptions for a to-do app. Reply with the description only: no quotes, no markdown, no preface. Write 1 to 2 sentences, under 250 characters.",
            },
            {
              role: "user",
              content: `Task title: ${title}\nWrite the description.`,
            },
          ],
        }),
      });

      if (!providerResponse.ok) {
        return response.status(502).json({ message: "AI service is unavailable." });
      }

      const data = await providerResponse.json();
      const description = data.choices?.[0]?.message?.content?.trim().slice(0, 300) || "";

      if (!description) {
        return response.status(502).json({ message: "AI service returned an empty description." });
      }

      return response.status(200).json({ description });
    }

    return response.status(502).json({ message: "AI service is unavailable." });
  } catch (error) {
    console.error("[ai] Unexpected description generation failure", error);
    return response.status(500).json({ message: "Unable to generate a task description." });
  }
});

export default router;
