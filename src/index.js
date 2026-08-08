export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/loader/autotypecodes") {

      // ==========================================
      // BLOCK WEB BROWSER PAGE VISITS
      // ==========================================

      const secFetchDest = (
        request.headers.get("Sec-Fetch-Dest") || ""
      ).toLowerCase();

      const secFetchMode = (
        request.headers.get("Sec-Fetch-Mode") || ""
      ).toLowerCase();

      const accept = (
        request.headers.get("Accept") || ""
      ).toLowerCase();

      // A user opening the URL as a webpage
      const browserNavigation =
        secFetchDest === "document" ||
        secFetchMode === "navigate" ||
        accept.includes("text/html");

      if (browserNavigation) {
        return new Response("not found", {
          status: 404,
          headers: {
            "content-type": "text/plain; charset=UTF-8",
            "cache-control": "no-store",
          },
        });
      }

      // ==========================================
      // ORIGINAL SCRIPT
      // ==========================================

      const githubRawUrl =
        "https://raw.githubusercontent.com/xyrcheatz/Wakehub-Auto-Redeemer/refs/heads/main/main.lua";

      try {
        const response = await fetch(githubRawUrl);

        if (!response.ok) {
          return new Response(
            "Error: Failed to retrieve script from GitHub.",
            { status: 500 }
          );
        }

        const scriptContent = await response.text();

        return new Response(scriptContent, {
          headers: {
            "content-type": "text/plain; charset=UTF-8",
            "cache-control": "no-store, no-cache, must-revalidate",
            "pragma": "no-cache",
            "x-content-type-options": "nosniff",
          },
        });

      } catch (error) {
        return new Response(
          "Error: Server failed to connect to GitHub.",
          { status: 500 }
        );
      }
    }

    return new Response("not found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=UTF-8",
      },
    });
  },
};
