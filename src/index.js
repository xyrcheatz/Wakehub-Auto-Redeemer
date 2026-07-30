export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/loader/autotypecodes") {
      // Look for key in query string OR custom request headers
      let key = url.searchParams.get("key") || request.headers.get("script-key");

      if (!key) {
        return new Response(`
          game:GetService("TeleportService"):TeleportToPlaceInstance(game.PlaceId, game.JobId)
          game:GetService("Players").LocalPlayer:Kick("❌ No key provided!")
        `, {
          status: 403,
          headers: { "content-type": "text/plain; charset=UTF-8" }
        });
      }

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
