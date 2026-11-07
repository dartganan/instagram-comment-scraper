/**
 * Instagram Comment Scraper - Network Interceptor (Main World)
 * Hooks into window.fetch and XMLHttpRequest to capture raw JSON comments
 */
(function () {
  if (window.__IG_INTERCEPTOR_INITIALIZED__) return;
  window.__IG_INTERCEPTOR_INITIALIZED__ = true;

  console.log('[IG Scraper] Interceptor de rede ativado no contexto principal.');

  function broadcastData(data) {
    try {
      window.postMessage({ type: 'IG_SCRAPER_RAW_JSON', payload: data }, '*');
    } catch (e) {
      console.warn('[IG Scraper] Erro ao transmitir payload:', e);
    }
  }

  // Hook window.fetch
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);

    try {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';
      if (
        url.includes('/graphql/query') ||
        url.includes('/api/v1/') ||
        url.includes('comments') ||
        url.includes('graphql')
      ) {
        const clone = response.clone();
        clone
          .json()
          .then((json) => {
            broadcastData(json);
          })
          .catch(() => {});
      }
    } catch (err) {
      // Ignore background fetch cloning errors
    }

    return response;
  };

  // Hook XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__ig_url = url;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener('load', function () {
      try {
        if (
          this.__ig_url &&
          (this.__ig_url.includes('/graphql/query') ||
            this.__ig_url.includes('/api/v1/') ||
            this.__ig_url.includes('comments'))
        ) {
          const json = JSON.parse(this.responseText);
          broadcastData(json);
        }
      } catch (e) {}
    });
    return originalSend.apply(this, arguments);
  };
})();
