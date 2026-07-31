export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/loader/autotypecodes") {
      // 1. Get the key provided by the executor (via headers or query params)
      const clientKey = request.headers.get("X-Script-Key") || url.searchParams.get("key");

      // 2. Define your valid key or check against an environment variable
      const validKey = env.VALID_KEY || "YOUR_SECRET_KEY_HERE"; 

      // 3. If the key is missing or invalid, return a "not found" response
      if (!clientKey || clientKey !== validKey) {
        return new Response("not found", { 
          status: 404,
          headers: { "content-type": "text/plain; charset=UTF-8" }
        });
      }

      const githubRawUrl = "https://raw.githubusercontent.com/xyrcheatz/Wakehub-Auto-Redeemer/refs/heads/main/main.lua";

      try {
        const response = await fetch(githubRawUrl);

        if (!response.ok) {
          return new Response("not found", { status: 404 });
        }

        const scriptContent = await response.text();

        return new Response(scriptContent, {
          headers: {
            "content-type": "text/plain; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (error) {
        return new Response("not found", { status: 404 });
      }
    }

    return new Response("not found", { 
      status: 404,
      headers: { "content-type": "text/plain; charset=UTF-8" }
    });
  },
};
