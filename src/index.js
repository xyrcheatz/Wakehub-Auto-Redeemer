export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/loader/autotypecodes") {
      return new Response("Not Found", { status: 404 });
    }

    const auth = request.headers.get("Authorization");

    if (auth !== `Bearer ${env.LOADER_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const response = await fetch(
      "https://raw.githubusercontent.com/xyrcheatz/Wakehub-Auto-Redeemer/refs/heads/main/main.lua"
    );

    if (!response.ok) {
      return new Response("Failed to fetch script", { status: 500 });
    }

    return new Response(await response.text(), {
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
      },
    });
  },
};
