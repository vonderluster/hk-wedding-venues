import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";

function anthropicProxy(apiKey: string): Plugin {
  return {
    name: "anthropic-proxy",
    configureServer(server) {
      server.middlewares.use("/api/recommend", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }

        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "ANTHROPIC_API_KEY not set in .env" }));
          return;
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = Buffer.concat(chunks).toString();

        try {
          const upstream = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json",
            },
            body,
          });

          const data = await upstream.json();
          res.statusCode = upstream.status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
        } catch (e) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load all .env vars (empty prefix = don't filter by VITE_)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/hk-wedding-venues/",
    plugins: [react(), anthropicProxy(env.ANTHROPIC_API_KEY ?? "")],
  };
});
