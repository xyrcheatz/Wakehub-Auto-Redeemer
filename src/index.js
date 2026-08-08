export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =========================================
    // PUBLIC LOADER
    // =========================================
    if (url.pathname === "/loader/autotypecodes") {
      const bootstrap = `
local key = script_key

if type(key) ~= "string" or key == "" then
    error("Invalid script key")
end

local code = game:HttpGet(
    "https://wake-auth.xyzcheatz.workers.dev/api/autotypecodes?key=" .. key
)

if code == "not found" then
    error("Invalid script key")
end

local fn, err = loadstring(code)

if not fn then
    error(err)
end

fn()
`;

      return new Response(bootstrap, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=UTF-8",
          "cache-control": "no-store"
        }
      });
    }


    // =========================================
    // PROTECTED ACTUAL SCRIPT
    // =========================================
    if (url.pathname === "/api/autotypecodes") {
      const providedKey = url.searchParams.get("key");

      if (
        !providedKey ||
        !env.SCRIPT_KEY ||
        providedKey !== env.SCRIPT_KEY
      ) {
        return new Response("not found", {
          status: 404,
          headers: {
            "content-type": "text/plain; charset=UTF-8",
            "cache-control": "no-store"
          }
        });
      }

      try {
        const githubRawUrl =
          "https://raw.githubusercontent.com/xyrcheatz/Wakehub-Auto-Redeemer/refs/heads/main/main.lua";

        const response = await fetch(githubRawUrl);

        if (!response.ok) {
          return new Response("not found", {
            status: 404
          });
        }

        const script = await response.text();

        return new Response(script, {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=UTF-8",
            "cache-control": "no-store, no-cache, must-revalidate",
            "pragma": "no-cache",
            "x-content-type-options": "nosniff"
          }
        });

      } catch {
        return new Response("not found", {
          status: 404
        });
      }
    }


    return new Response("not found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=UTF-8"
      }
    });
  }
};
