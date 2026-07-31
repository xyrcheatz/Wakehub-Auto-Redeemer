export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // When your executor requests the loader path
    if (url.pathname === "/loader/autotypecodes") {
      const githubRawUrl = "https://raw.githubusercontent.com/xyrcheatz/Wakehub-Auto-Redeemer/refs/heads/main/main.lua";

      try {
        const response = await fetch(githubRawUrl);

        if (!response.ok) {
          return new Response("Error: Failed to retrieve script from GitHub.", { status: 500 });
        }

        const scriptContent = await response.text();

        // Return the raw script so your executor can read `script_key` locally
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
