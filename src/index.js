export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/loader/autotypecodes") {
      // 1. Grab the key from the URL query string (?key=...)
      let key = url.searchParams.get("key");

      // 2. (Optional backup) If your key system passes it differently, you can check headers too
      if (!key) {
        key = request.headers.get("script-key") || request.headers.get("authorization");
      }

      // 3. If no key is found at all, kick them or block them
      if (!key) {
        return new Response(`
          game:GetService("TeleportService"):TeleportToPlaceInstance(game.PlaceId, game.JobId)
          game:GetService("Players").LocalPlayer:Kick("❌ No key provided!")
        `, {
          status: 403,
          headers: { "content-type": "text/plain; charset=UTF-8" }
        });
      }

      // TODO: Add your database/KV check here to verify if `key` is valid!
      // For now, it checks if a key string was provided.

      const githubRawUrl = "https://raw.githubusercontent.com/xyrcheatz/Wakehub-Auto-Redeemer/refs/heads/main/main.lua";

      try {
        const response = await fetch(githubRawUrl);

        if (!response.ok) {
          return new Response("Error: Failed to retrieve script from GitHub.", { status: 500 });
        }

        const scriptContent = await response.text();

        return new Response(scriptContent, {
          headers: {
            "content-type": "text/plain; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (error) {
        return new Response("Error: Server failed to connect to GitHub.", { status: 500 });
      }
    }

    return new Response("not found", { 
      status: 404,
      headers: { "content-type": "text/plain; charset=UTF-8" }
    });
  },
};
