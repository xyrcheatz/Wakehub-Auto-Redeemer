export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname !== "/loader/autotypecodes") {
      return new Response("not found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=UTF-8",
        },
      });
    }

    // Executor must send:
    // X-Script-Key: your-secret-key
    const providedKey = request.headers.get("X-Script-Key");

    // Store SCRIPT_KEY as a Cloudflare Worker secret
    if (!providedKey || !env.SCRIPT_KEY || providedKey !== env.SCRIPT_KEY) {
      // Don't reveal whether authentication failed
      return new Response("not found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=UTF-8",
          "cache-control": "no-store",
        },
      });
    }

    const githubRawUrl =
      "https://raw.githubusercontent.com/xyrcheatz/Wakehub-Auto-Redeemer/refs/heads/main/main.lua";

    try {
      const response = await fetch(githubRawUrl, {
        headers: {
          "User-Agent": "WakeHub-Loader",
        },
      });

      if (!response.ok) {
        return new Response("not found", {
          status: 404,
          headers: {
            "content-type": "text/plain; charset=UTF-8",
            "cache-control": "no-store",
          },
        });
      }

      const scriptContent = await response.text();

      return new Response(scriptContent, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=UTF-8",
          "cache-control": "no-store, no-cache, must-revalidate",
          "pragma": "no-cache",
          "x-content-type-options": "nosniff",
        },
      });
    } catch {
      return new Response("not found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=UTF-8",
          "cache-control": "no-store",
        },
      });
    }
  },
};
