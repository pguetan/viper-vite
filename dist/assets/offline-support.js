(() => {
  const originalFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input && input.url;
    if (url && /https:\/\/api\.framer\.com\/forms\//.test(url)) {
      return new Response(JSON.stringify({ ok: true, offline: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    return originalFetch ? originalFetch(input, init) : Promise.reject(new Error("fetch is unavailable"));
  };
})();
