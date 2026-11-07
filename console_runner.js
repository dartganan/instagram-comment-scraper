/**
 * Instagram Comment Scraper & Exporter v1.3.0 - Console Runner
 * Execute diretamente no Console (F12 -> Console) da aba do Instagram!
 * Inclui Expansão Dedicada de Threads ("Ver respostas"), Badges Visuais e Metadados do Post.
 */
(function() {
  'use strict';

  // 1. Injetar CSS
  let style = document.getElementById('ig-scraper-css-injected');
  if (!style) {
    style = document.createElement('style');
    style.id = 'ig-scraper-css-injected';
    document.head.appendChild(style);
  }
  style.textContent = `/* Scoped styles for Instagram Comment Scraper Extension */
#ig-scraper-launcher {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999999;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 30px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(220, 39, 67, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;
  user-select: none;
}

#ig-scraper-launcher:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 16px rgba(220, 39, 67, 0.6);
}

#ig-scraper-launcher .ig-badge {
  background: rgba(255, 255, 255, 0.25);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

#ig-scraper-panel {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 400px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 48px);
  background: rgba(18, 18, 18, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7);
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #efefef;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease;
  box-sizing: border-box;
}

#ig-scraper-panel * {
  box-sizing: border-box;
}

#ig-scraper-panel.hidden {
  display: none !important;
}

/* Gradient accent bar */
.ig-accent-bar {
  height: 4px;
  width: 100%;
  background: linear-gradient(90deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

/* Header */
.ig-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  cursor: grab;
  user-select: none;
}

.ig-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.ig-header-title svg {
  width: 18px;
  height: 18px;
  fill: url(#ig-grad);
}

.ig-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ig-icon-btn {
  background: transparent;
  border: none;
  color: #a8a8a8;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 16px;
  line-height: 1;
  transition: all 0.15s;
}

.ig-icon-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

/* Content Body */
.ig-body {
  padding: 14px 16px;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Post Info Card */
.ig-post-info-card {
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid #e1306c;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ig-post-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ig-post-author {
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

.ig-post-link-btn {
  font-size: 11px;
  color: #0095f6;
  text-decoration: none;
}

.ig-post-link-btn:hover {
  text-decoration: underline;
}

.ig-post-caption-preview {
  font-size: 11.5px;
  color: #b5b5b5;
  line-height: 1.35;
  max-height: 48px;
  overflow-y: auto;
  word-break: break-word;
  white-space: pre-wrap;
}

/* Status section */
.ig-status-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 14px;
}

.ig-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.ig-status-badge {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #b0b0b0;
}

.ig-status-badge.ready {
  background: rgba(0, 149, 246, 0.2);
  color: #0095f6;
}

.ig-status-badge.running {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  animation: ig-pulse 1.5s infinite;
}

.ig-status-badge.paused {
  background: rgba(250, 204, 21, 0.2);
  color: #facc15;
}

.ig-status-badge.completed {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
}

@keyframes ig-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.ig-count-text {
  font-size: 13px;
  font-weight: 600;
  color: #efefef;
}

.ig-progress-container {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 6px;
}

.ig-progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #f09433, #dc2743, #bc1888);
  transition: width 0.3s ease;
}

.ig-status-detail {
  font-size: 11px;
  color: #8e8e8e;
  margin-top: 4px;
}

/* Config Inputs */
.ig-section-title {
  font-size: 12px;
  font-weight: 600;
  color: #a8a8a8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.ig-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ig-limit-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ig-input {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
  width: 100px;
  outline: none;
  transition: border-color 0.2s;
}

.ig-input:focus {
  border-color: #e1306c;
}

.ig-presets {
  display: flex;
  gap: 4px;
  flex: 1;
}

.ig-preset-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #d0d0d0;
  font-size: 12px;
  padding: 6px 8px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  transition: all 0.15s;
}

.ig-preset-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
}

.ig-preset-btn.active {
  background: rgba(225, 48, 108, 0.25);
  border-color: #e1306c;
  color: #ffffff;
  font-weight: 600;
}

/* Options */
.ig-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ig-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #cccccc;
  cursor: pointer;
}

.ig-checkbox-label input[type="checkbox"] {
  accent-color: #e1306c;
  width: 14px;
  height: 14px;
  cursor: pointer;
}

/* Action Buttons */
.ig-buttons-row {
  display: flex;
  gap: 8px;
}

.ig-btn {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}

.ig-btn-primary {
  background: linear-gradient(45deg, #f09433, #dc2743, #bc1888);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(220, 39, 67, 0.3);
}

.ig-btn-primary:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(220, 39, 67, 0.45);
}

.ig-btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #efefef;
}

.ig-btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
}

.ig-btn-danger {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.ig-btn-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.35);
}

.ig-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

/* Preview Drawer */
.ig-preview-section {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 10px;
}

.ig-preview-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #a8a8a8;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
}

.ig-preview-toggle:hover {
  color: #ffffff;
}

.ig-preview-list {
  margin-top: 8px;
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 4px;
}

.ig-preview-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  transition: all 0.2s ease;
}

.ig-preview-item.ig-is-reply {
  margin-left: 14px;
  border-left: 2.5px solid #a855f7;
  background: rgba(168, 85, 247, 0.06);
}

.ig-preview-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.ig-preview-user {
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
}

.ig-preview-user:hover {
  text-decoration: underline;
  color: #0095f6;
}

.ig-reply-badge {
  font-size: 9px;
  background: rgba(168, 85, 247, 0.3);
  color: #d8b4fe;
  padding: 1px 5px;
  border-radius: 4px;
  margin-left: 5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.ig-caption-badge {
  font-size: 9px;
  background: rgba(225, 48, 108, 0.3);
  color: #f472b6;
  padding: 1px 5px;
  border-radius: 4px;
  margin-left: 5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.ig-preview-time {
  font-size: 10px;
  color: #8e8e8e;
}

.ig-preview-text {
  color: #d4d4d4;
  line-height: 1.35;
  word-break: break-word;
  white-space: pre-wrap;
}

/* Export Bar */
.ig-export-section {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ig-export-btns {
  display: flex;
  gap: 6px;
}

.ig-export-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 8px 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.15s;
}

.ig-export-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.25);
}

.ig-export-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Scrollbar customization */
#ig-scraper-panel ::-webkit-scrollbar {
  width: 5px;
}

#ig-scraper-panel ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

#ig-scraper-panel ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

#ig-scraper-panel ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
`;

  // 2. Limpar instâncias antigas se houver
  const oldPanel = document.getElementById('ig-scraper-panel');
  if (oldPanel) oldPanel.remove();
  const oldLauncher = document.getElementById('ig-scraper-launcher');
  if (oldLauncher) oldLauncher.remove();
  window.__IG_SCRAPER_PANEL_INJECTED__ = false;

  // 3. Executar Interceptor de Rede
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


  // 4. Executar Motor do Scraper
/**
 * Instagram Comment Scraper & Exporter v1.3.0
 * Content Script (Manifest V3)
 * Dual-Engine: GraphQL/Fetch Interception + Universal Semantic DOM Walker
 * Includes Dedicated Thread Expansion Engine ("Ver respostas") & Post Metadata
 */

(function () {
  'use strict';

  // Prevent duplicate UI injection
  if (window.__IG_SCRAPER_PANEL_INJECTED__) return;
  window.__IG_SCRAPER_PANEL_INJECTED__ = true;

  // --- STATE ---
  const state = {
    isRunning: false,
    isPaused: false,
    targetCount: 100, // 0 = unlimited / all
    includeCaption: true,
    expandReplies: false,
    delayMs: 1500,
    captured: new Map(), // key -> comment object
    postShortcode: '',
    postAuthor: '',
    postCaption: '',
    postedAt: '',
    consecutiveEmptyAttempts: 0,
    maxEmptyAttempts: 15,
  };

  // --- HELPER: GET POST IDENTIFIER ---
  function getPostShortcode() {
    const match = window.location.pathname.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
    return match ? match[2] : 'post';
  }

  function getCleanPostUrl() {
    return window.location.origin + window.location.pathname;
  }

  function sleep(ms) {
    const jitter = Math.floor(Math.random() * 300);
    return new Promise((resolve) => setTimeout(resolve, ms + jitter));
  }

  // --- EXTRACT POST METADATA (URL, AUTHOR, CAPTION) ---
  function extractPostMetadata() {
    state.postShortcode = getPostShortcode();

    // 1. Author from URL: /username/p/shortcode/
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 3 && (pathParts[1] === 'p' || pathParts[1] === 'reel')) {
      state.postAuthor = pathParts[0];
    }

    // 2. Author from Header element if not found
    if (!state.postAuthor) {
      const headerLink = document.querySelector(
        'header a[role="link"], article header a, main header a'
      );
      if (headerLink) {
        const href = headerLink.getAttribute('href') || '';
        const m = href.match(/^\/([a-zA-Z0-9_\.]+)\/?$/);
        if (m) state.postAuthor = m[1];
      }
    }

    // 3. Caption from OpenGraph meta tags
    if (!state.postCaption) {
      const metaOg =
        document.querySelector('meta[property="og:description"]') ||
        document.querySelector('meta[name="description"]');
      if (metaOg) {
        const content = metaOg.getAttribute('content') || '';
        const quoteMatch = content.match(/:\s*"(.*?)"$/s) || content.match(/:\s*“(.*?)”$/s);
        if (quoteMatch) {
          state.postCaption = quoteMatch[1];
        } else if (content.includes(' - ')) {
          const parts = content.split(' - ');
          if (parts[1]) state.postCaption = parts[1];
        }
      }
    }

    // 4. Caption from DOM (h1 or first dir="auto" inside article/main)
    if (!state.postCaption) {
      const h1El = document.querySelector('article h1, main h1');
      if (h1El) {
        state.postCaption = h1El.textContent.trim();
      }
    }

    // 5. Caption from first captured item (caption row)
    if (!state.postCaption) {
      for (const c of state.captured.values()) {
        if (
          c.isCaption ||
          (state.postAuthor && c.username.toLowerCase() === state.postAuthor.toLowerCase())
        ) {
          state.postCaption = c.text;
          if (!state.postAuthor) state.postAuthor = c.username;
          break;
        }
      }
    }

    updatePostInfoCard();

    return {
      postUrl: getCleanPostUrl(),
      shortcode: state.postShortcode,
      author: state.postAuthor || 'desconhecido',
      authorUrl: state.postAuthor ? `https://www.instagram.com/${state.postAuthor}/` : '',
      caption: state.postCaption || '',
      postedAt: state.postedAt || '',
      extractedAt: new Date().toISOString(),
      totalComments: state.captured.size,
    };
  }

  // --- ENGINE 1: RECURSIVE JSON COMMENT EXTRACTOR (FROM INTERCEPTOR) ---
  function extractCommentsFromJSON(obj, results = [], isReplyContext = false) {
    if (!obj || typeof obj !== 'object') return results;

    // Check for Post Media root metadata
    const media =
      obj.shortcode_media ||
      obj.xdt_shortcode_media ||
      obj.media ||
      (obj.data && (obj.data.shortcode_media || obj.data.xdt_shortcode_media));

    if (media) {
      if (media.owner && media.owner.username) {
        state.postAuthor = media.owner.username;
      }
      if (
        media.edge_media_to_caption &&
        media.edge_media_to_caption.edges &&
        media.edge_media_to_caption.edges[0]
      ) {
        state.postCaption = media.edge_media_to_caption.edges[0].node.text || '';
      } else if (media.caption && typeof media.caption.text === 'string') {
        state.postCaption = media.caption.text;
      }
      if (media.taken_at_timestamp) {
        state.postedAt = new Date(media.taken_at_timestamp * 1000).toISOString();
      }
      updatePostInfoCard();
    }

    // Check if this object is an Instagram comment node
    const text = obj.text || obj.comment_text;
    const user = obj.owner || obj.user;
    const id = obj.id || obj.pk;

    if (text && user && id) {
      const username = user.username || '';
      const avatar = user.profile_pic_url || '';
      const created_at = obj.created_at || obj.created_at_utc;
      const likes =
        (obj.edge_liked_by && obj.edge_liked_by.count) ||
        obj.comment_like_count ||
        0;

      const isReply = isReplyContext || Boolean(obj.parent_comment_id) || text.trim().startsWith('@');

      if (username && text.trim()) {
        results.push({
          id: String(id),
          username: username.replace(/^@/, ''),
          userUrl: `https://www.instagram.com/${username}/`,
          avatar,
          text: text.trim(),
          datetime: created_at ? new Date(created_at * 1000).toISOString() : '',
          timeAgo: '',
          likes,
          isReply: isReply,
          isCaption: false,
          capturedAt: new Date().toISOString(),
        });
      }
    }

    // Traverse arrays and object keys recursively, propagating reply context
    if (Array.isArray(obj)) {
      for (const item of obj) extractCommentsFromJSON(item, results, isReplyContext);
    } else {
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object') {
          const nextIsReply =
            isReplyContext ||
            key.includes('threaded') ||
            key.includes('child_comments') ||
            key.includes('replies');
          extractCommentsFromJSON(obj[key], results, nextIsReply);
        }
      }
    }

    return results;
  }

  // Listen to intercepted JSON messages
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'IG_SCRAPER_RAW_JSON' && event.data.payload) {
      try {
        const jsonComments = extractCommentsFromJSON(event.data.payload);
        if (jsonComments.length > 0) {
          let added = 0;
          jsonComments.forEach((c) => {
            const key = `json_${c.username.toLowerCase()}_${c.text.substring(0, 45)}`;
            if (!state.captured.has(key)) {
              c.key = key;
              c.index = state.captured.size + 1;
              state.captured.set(key, c);
              addPreviewItem(c);
              added++;
            }
          });
          if (added > 0) {
            state.consecutiveEmptyAttempts = 0;
            updateUI();
          }
        }
      } catch (err) {
        console.warn('[IG Scraper] Erro ao processar payload JSON:', err);
      }
    }
  });

  // --- ENGINE 2: UNIVERSAL SEMANTIC DOM WALKER (NO UL DEPENDENCY) ---
  function extractCommentsFromDOM() {
    const timeElements = Array.from(document.querySelectorAll('time'));
    let newFound = 0;

    timeElements.forEach((timeEl, index) => {
      try {
        const datetime = timeEl.getAttribute('datetime') || '';
        const timeAgo = (timeEl.textContent || '').trim();

        // Walk up DOM to find enclosing comment row
        let ancestor = timeEl.parentElement;
        let row = null;

        for (let depth = 0; depth < 8 && ancestor && ancestor !== document.body; depth++) {
          const userLinks = Array.from(ancestor.querySelectorAll('a[href^="/"]')).filter((a) => {
            const h = a.getAttribute('href') || '';
            return (
              !h.includes('/p/') &&
              !h.includes('/reel/') &&
              !h.includes('/explore/') &&
              !h.includes('/tags/') &&
              !h.includes('/audio/') &&
              !h.includes('/direct/')
            );
          });

          if (userLinks.length >= 1 && ancestor.textContent.length > timeAgo.length + 3) {
            row = ancestor;
            if (ancestor.tagName === 'LI' || ancestor.querySelector('img')) {
              break;
            }
          }
          ancestor = ancestor.parentElement;
        }

        if (!row) return;

        const userLinks = Array.from(row.querySelectorAll('a[href^="/"]')).filter((a) => {
          const h = a.getAttribute('href') || '';
          return (
            !h.includes('/p/') &&
            !h.includes('/reel/') &&
            !h.includes('/explore/') &&
            !h.includes('/tags/') &&
            !h.includes('/audio/') &&
            !h.includes('/direct/')
          );
        });

        if (userLinks.length === 0) return;

        const userLink = userLinks[0];
        let username = (userLink.textContent || '').trim().replace(/^@/, '');
        const href = userLink.getAttribute('href') || '';
        const hrefMatch = href.match(/^\/([a-zA-Z0-9_\.]+)\/?$/);
        if (hrefMatch && !username) username = hrefMatch[1];
        if (!username) return;

        const userUrl = `https://www.instagram.com/${username}/`;
        const img = row.querySelector('img');
        const avatar = img ? img.src : '';

        // Extract comment text
        let text = '';
        const dirAutoSpans = Array.from(row.querySelectorAll('span[dir="auto"], div[dir="auto"]'));

        for (const span of dirAutoSpans) {
          const sText = (span.textContent || '').trim();
          if (sText && sText !== username && sText !== timeAgo) {
            text = sText;
            break;
          }
        }

        // Fallback text extraction
        if (!text) {
          const allSpans = Array.from(row.querySelectorAll('span'));
          for (const s of allSpans) {
            const content = (s.textContent || '').trim();
            const lower = content.toLowerCase();
            if (
              content.length > 1 &&
              content !== username &&
              content !== timeAgo &&
              !lower.includes('responder') &&
              !lower.includes('reply') &&
              !lower.includes('curtida') &&
              !lower.includes('like') &&
              !lower.includes('ver tradução') &&
              !lower.includes('see translation')
            ) {
              text = content;
              break;
            }
          }
        }

        // Clean leading username from text
        if (text) {
          const reClean = new RegExp('^@?' + escapeRegExp(username) + '\\s*', 'i');
          text = text.replace(reClean, '').trim();
        }

        if (!text) return;

        // Likes count
        let likes = 0;
        const likesMatch = row.textContent.match(/(\d+[\.,]?\d*)\s*(curtida|like)/i);
        if (likesMatch) {
          likes = parseInt(likesMatch[1].replace(/\D/g, ''), 10) || 0;
        }

        const isFirst = index === 0;

        // Save caption if this is the first item
        if (isFirst) {
          if (!state.postCaption) state.postCaption = text;
          if (!state.postAuthor) state.postAuthor = username;
          updatePostInfoCard();
          if (!state.includeCaption) {
            return;
          }
        }

        // Detect if this comment is a reply (thread)
        let isReply = false;

        // Check 1: Indentation via computed style padding/margin on ancestors
        let checkEl = row;
        for (let i = 0; i < 4 && checkEl && checkEl !== document.body; i++) {
          const cs = window.getComputedStyle(checkEl);
          const pl = parseInt(cs.paddingLeft, 10) || 0;
          const ml = parseInt(cs.marginLeft, 10) || 0;
          if (pl >= 24 || ml >= 24) {
            isReply = true;
            break;
          }
          checkEl = checkEl.parentElement;
        }

        // Check 2: Text starts with mention (@username)
        if (!isReply && text.startsWith('@')) {
          isReply = true;
        }

        // Check 3: Avatar is smaller (replies use ~24-28px avatar, root comments use 32-44px)
        if (!isReply && img && img.clientWidth > 0 && img.clientWidth <= 28) {
          isReply = true;
        }

        // Check 4: Container class names or thread region
        if (
          !isReply &&
          (row.closest('[class*="reply" i], [class*="Thread" i]') ||
            row.closest('ul ul'))
        ) {
          isReply = true;
        }

        // Deduplication key
        const key = `dom_${username.toLowerCase()}_${text.substring(0, 45)}`;
        if (!state.captured.has(key)) {
          const commentData = {
            id: key,
            key,
            username,
            userUrl,
            avatar,
            text,
            datetime,
            timeAgo,
            likes,
            isReply: isReply && !isFirst,
            isCaption: isFirst,
            capturedAt: new Date().toISOString(),
            index: state.captured.size + 1,
          };
          state.captured.set(key, commentData);
          addPreviewItem(commentData);
          newFound++;
        }
      } catch (err) {
        // Continue parsing next time tag
      }
    });

    return newFound;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // --- ENGINE 3: DEDICATED THREAD EXPANSION ("Ver respostas") ---
  function expandReplyThreads() {
    if (!state.expandReplies) return 0;

    let clickedCount = 0;
    const candidates = Array.from(document.querySelectorAll('button, div[role="button"], span'));
    const buttonsToClick = [];

    for (const el of candidates) {
      const text = (el.textContent || '').trim().toLowerCase();

      // NEVER click "Ocultar respostas" or "Hide replies"!
      if (text.includes('ocultar') || text.includes('hide')) {
        continue;
      }

      // Check for reply triggers:
      // "ver respostas (3)", "ver 1 resposta", "ver mais respostas", "view replies", "view 1 reply"
      const isReplyTrigger =
        (text.includes('ver') && text.includes('respost')) ||
        (text.includes('view') && text.includes('repl')) ||
        (text.includes('mais') && text.includes('respost')) ||
        (text.includes('more') && text.includes('repl'));

      if (isReplyTrigger) {
        const btn = el.closest('button') || el.closest('div[role="button"]') || el;

        // Deduplicate in this cycle and skip recently clicked
        if (
          !buttonsToClick.includes(btn) &&
          !btn.hasAttribute('data-ig-reply-clicked')
        ) {
          buttonsToClick.push(btn);
        }
      }
    }

    // Click up to 3 buttons per cycle to let Instagram load smoothly
    for (const btn of buttonsToClick.slice(0, 3)) {
      btn.setAttribute('data-ig-reply-clicked', 'true');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      simulateClick(btn);
      clickedCount++;

      // Unlock after 4 seconds in case Instagram reuses the element or request timed out
      setTimeout(() => {
        if (btn && btn.isConnected) {
          btn.removeAttribute('data-ig-reply-clicked');
        }
      }, 4000);
    }

    return clickedCount;
  }

  // --- ENGINE 4: SCROLL & LOAD MORE MAIN COMMENTS ---
  function getScrollContainers() {
    const list = [];
    const all = Array.from(document.querySelectorAll('div, section, article, main'));
    for (const el of all) {
      if (el.scrollHeight > el.clientHeight + 20) {
        const style = window.getComputedStyle(el);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          if (el.querySelector('time')) {
            list.unshift(el);
          } else {
            list.push(el);
          }
        }
      }
    }
    list.push(document.documentElement);
    list.push(document.body);
    return list;
  }

  function triggerScrollAction() {
    const containers = getScrollContainers();
    for (const c of containers) {
      if (c && c.scrollHeight > c.clientHeight) {
        c.scrollTop = c.scrollHeight;
        c.dispatchEvent(new Event('scroll', { bubbles: true }));
      }
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function clickLoadMoreButtons() {
    let clicked = false;
    const candidates = Array.from(
      document.querySelectorAll('button, div[role="button"], span, svg, a')
    );

    for (const el of candidates) {
      const text = (el.textContent || '').trim().toLowerCase();
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();

      // Exclude replies buttons from the main "Load more comments" clicker
      if (text.includes('respost') || text.includes('reply') || text.includes('replies')) {
        continue;
      }

      const isLoadMore =
        text.includes('carregar mais') ||
        text.includes('load more') ||
        text.includes('ver mais comentários') ||
        text.includes('view more comments') ||
        text.includes('mais comentários') ||
        aria.includes('carregar') ||
        aria.includes('load') ||
        aria.includes('mais comentários') ||
        aria.includes('more comments');

      if (isLoadMore) {
        const target = el.closest('button') || el.closest('div[role="button"]') || el;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        simulateClick(target);
        clicked = true;
        break;
      }
    }

    return clicked;
  }

  function simulateClick(element) {
    if (!element) return;
    try {
      element.click();
    } catch (e) {}
    element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  }

  // --- AUTOMATION STEP LOOP ---
  async function scraperLoop() {
    if (!state.isRunning || state.isPaused) return;

    extractPostMetadata();

    // Step 1: Harvest comments from DOM
    const newItems = extractCommentsFromDOM();
    updateUI();

    // Check target reached
    if (state.targetCount > 0 && state.captured.size >= state.targetCount) {
      stopScraper('Concluído! Meta de comentários atingida.');
      return;
    }

    // Step 2: Expand reply threads (if enabled)
    let repliesClicked = 0;
    if (state.expandReplies) {
      repliesClicked = expandReplyThreads();
      if (repliesClicked > 0) {
        updateStatusDetail(`Expandindo ${repliesClicked} thread(s) de respostas...`);
        // Wait 800ms for Instagram to fetch and render the child comments
        await sleep(800);
        extractCommentsFromDOM();
        updateUI();
      }
    }

    // Step 3: Click main "Load more"
    const clickedButton = clickLoadMoreButtons();

    // Step 4: Trigger scroll
    triggerScrollAction();

    // Step 5: Count replies and update status
    let replyCount = 0;
    state.captured.forEach((c) => {
      if (c.isReply) replyCount++;
    });

    updateStatusDetail(
      `Varredura ativa (${state.captured.size} capturados | ${replyCount} respostas | ${state.consecutiveEmptyAttempts}/${state.maxEmptyAttempts} tentativas)`
    );

    // Step 6: Inactivity check
    if (newItems === 0 && !clickedButton && repliesClicked === 0) {
      state.consecutiveEmptyAttempts++;
      if (state.consecutiveEmptyAttempts >= state.maxEmptyAttempts) {
        stopScraper(
          state.captured.size > 0
            ? 'Fim dos comentários alcançado!'
            : 'Nenhum comentário detectado. Verifique se o post possui comentários públicos.'
        );
        return;
      }
    } else {
      state.consecutiveEmptyAttempts = 0;
    }

    await sleep(state.delayMs);

    if (state.isRunning && !state.isPaused) {
      scraperLoop();
    }
  }

  // --- CONTROLS ---
  function startScraper() {
    if (state.isRunning && !state.isPaused) return;

    extractPostMetadata();
    state.isRunning = true;
    state.isPaused = false;
    state.consecutiveEmptyAttempts = 0;

    const limitInput = document.getElementById('ig-limit-input');
    if (limitInput) {
      const val = parseInt(limitInput.value, 10);
      state.targetCount = isNaN(val) || val <= 0 ? 0 : val;
    }

    // Read current state of checkboxes
    const optReplies = document.getElementById('ig-opt-replies');
    if (optReplies) {
      state.expandReplies = optReplies.checked;
    }

    setStatusBadge('running', 'Capturando...');
    setButtonStates();

    extractCommentsFromDOM();
    triggerScrollAction();
    updateUI();

    scraperLoop();
  }

  function pauseScraper() {
    state.isPaused = true;
    setStatusBadge('paused', 'Pausado');
    setButtonStates();
  }

  function stopScraper(message = 'Parado') {
    state.isRunning = false;
    state.isPaused = false;
    setStatusBadge('completed', message);
    setButtonStates();
    updateUI();
    extractPostMetadata();
  }

  function clearCaptured() {
    if (state.isRunning) return;
    state.captured.clear();
    const list = document.getElementById('ig-preview-list');
    if (list) list.innerHTML = '';
    updateUI();
    setStatusBadge('ready', 'Pronto');
    updateStatusDetail('Defina a meta e clique em Iniciar');
  }

  // --- EXPORT FUNCTIONS (WITH POST URL, AUTHOR & CONTENT) ---
  function exportCSV() {
    if (state.captured.size === 0) {
      alert('Nenhum comentário capturado para exportar!');
      return;
    }

    const meta = extractPostMetadata();

    const headers = [
      'ID',
      'Post_URL',
      'Post_Autor',
      'Post_Legenda',
      'Usuario',
      'Perfil_URL',
      'Comentario_Texto',
      'Data_Comentario_ISO',
      'Tempo_Relativo',
      'Curtidas',
      'E_Resposta',
      'Data_Captura',
    ];

    const rows = [headers.join(',')];

    state.captured.forEach((c) => {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      rows.push(
        [
          c.index,
          escape(meta.postUrl),
          escape(meta.author),
          escape(meta.caption),
          escape(c.username),
          escape(c.userUrl),
          escape(c.text),
          escape(c.datetime),
          escape(c.timeAgo),
          c.likes,
          c.isReply ? 'Sim' : 'Não',
          escape(c.capturedAt),
        ].join(',')
      );
    });

    const csvContent = '\uFEFF' + rows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `instagram_${meta.author || 'post'}_${meta.shortcode}_${Date.now()}.csv`;
    downloadBlob(blob, filename);
  }

  function exportJSON() {
    if (state.captured.size === 0) {
      alert('Nenhum comentário capturado para exportar!');
      return;
    }

    const meta = extractPostMetadata();

    const exportData = {
      post_info: {
        url: meta.postUrl,
        shortcode: meta.shortcode,
        author: meta.author,
        author_url: meta.authorUrl,
        caption: meta.caption,
        posted_at: meta.postedAt || '',
        extracted_at: meta.extractedAt,
        total_comments: state.captured.size,
      },
      comments: Array.from(state.captured.values()).map((c) => ({
        index: c.index,
        username: c.username,
        user_url: c.userUrl,
        avatar_url: c.avatar,
        comment_text: c.text,
        likes: c.likes,
        datetime_iso: c.datetime,
        time_ago: c.timeAgo,
        is_reply: c.isReply,
        is_caption: c.isCaption,
        captured_at: c.capturedAt,
      })),
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const filename = `instagram_${meta.author || 'post'}_${meta.shortcode}_${Date.now()}.json`;
    downloadBlob(blob, filename);
  }

  function copyToClipboard() {
    if (state.captured.size === 0) {
      alert('Nenhum comentário capturado para copiar!');
      return;
    }

    const meta = extractPostMetadata();

    const lines = [
      '==================================================',
      `POST: ${meta.postUrl}`,
      `AUTOR: @${meta.author}`,
      `CONTEÚDO/LEGENDA:\n${meta.caption || '(Sem legenda)'}`,
      `TOTAL DE COMENTÁRIOS: ${state.captured.size}`,
      `DATA DA EXTRAÇÃO: ${new Date().toLocaleString('pt-BR')}`,
      '==================================================\n',
    ];

    state.captured.forEach((c) => {
      lines.push(`${c.isReply ? '  ↳ ' : ''}@${c.username}: ${c.text}`);
    });

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      const btn = document.getElementById('ig-btn-copy');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Copiado com dados do post!';
        setTimeout(() => {
          btn.innerHTML = orig;
        }, 2200);
      }
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- UI CREATION ---
  function createUI() {
    if (document.getElementById('ig-scraper-panel')) return;

    // Launcher Pill
    const launcher = document.createElement('div');
    launcher.id = 'ig-scraper-launcher';
    launcher.innerHTML = `
      <span>💬 Capturar Comentários</span>
      <span class="ig-badge" id="ig-launcher-count">0</span>
    `;
    launcher.addEventListener('click', togglePanel);
    document.body.appendChild(launcher);

    // Main Floating Panel
    const panel = document.createElement('div');
    panel.id = 'ig-scraper-panel';
    panel.innerHTML = `
      <div class="ig-accent-bar"></div>
      <div class="ig-header" id="ig-drag-header">
        <div class="ig-header-title">
          <svg viewBox="0 0 24 24"><defs><linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f09433"/><stop offset="50%" stop-color="#dc2743"/><stop offset="100%" stop-color="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          <span>IG Scraper v1.3</span>
        </div>
        <div class="ig-header-actions">
          <button class="ig-icon-btn" id="ig-btn-minimize" title="Minimizar">_</button>
          <button class="ig-icon-btn" id="ig-btn-close" title="Fechar">✕</button>
        </div>
      </div>

      <div class="ig-body">
        <!-- Post Info Box -->
        <div class="ig-post-info-card" id="ig-post-info-card">
          <div class="ig-post-info-header">
            <span class="ig-post-author" id="ig-info-author">@identificando...</span>
            <a class="ig-post-link-btn" id="ig-info-link" href="#" target="_blank">🔗 Link do Post</a>
          </div>
          <div class="ig-post-caption-preview" id="ig-info-caption">Lendo conteúdo/legenda do post...</div>
        </div>

        <!-- Status Box -->
        <div class="ig-status-box">
          <div class="ig-status-header">
            <span class="ig-status-badge ready" id="ig-status-badge">Pronto</span>
            <span class="ig-count-text" id="ig-count-display">0 comentários</span>
          </div>
          <div class="ig-progress-container">
            <div class="ig-progress-bar" id="ig-progress-bar"></div>
          </div>
          <div class="ig-status-detail" id="ig-status-detail">Defina a meta e clique em Iniciar</div>
        </div>

        <!-- Limit Input & Presets -->
        <div class="ig-input-group">
          <div class="ig-section-title">Meta de comentários (X)</div>
          <div class="ig-limit-row">
            <input type="number" id="ig-limit-input" class="ig-input" value="100" min="0" step="50" placeholder="Qtd" />
            <div class="ig-presets">
              <button class="ig-preset-btn" data-val="50">50</button>
              <button class="ig-preset-btn active" data-val="100">100</button>
              <button class="ig-preset-btn" data-val="250">250</button>
              <button class="ig-preset-btn" data-val="0">Todos</button>
            </div>
          </div>
        </div>

        <!-- Options -->
        <div class="ig-options">
          <label class="ig-checkbox-label">
            <input type="checkbox" id="ig-opt-caption" checked />
            <span>Incluir legenda do autor como 1º item</span>
          </label>
          <label class="ig-checkbox-label" style="font-weight:600;color:#d8b4fe;">
            <input type="checkbox" id="ig-opt-replies" checked />
            <span>Expandir e capturar respostas (threads) 💬</span>
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="ig-buttons-row">
          <button class="ig-btn ig-btn-primary" id="ig-btn-start">▶ Iniciar</button>
          <button class="ig-btn ig-btn-secondary" id="ig-btn-pause" disabled>⏸ Pausar</button>
          <button class="ig-btn ig-btn-danger" id="ig-btn-stop" disabled>⏹ Parar</button>
        </div>

        <!-- Live Preview Accordion -->
        <div class="ig-preview-section">
          <div class="ig-preview-toggle" id="ig-preview-toggle">
            <span>Pré-visualização ao vivo</span>
            <span id="ig-preview-arrow">▾</span>
          </div>
          <div class="ig-preview-list" id="ig-preview-list"></div>
        </div>

        <!-- Export Toolbar -->
        <div class="ig-export-section">
          <div class="ig-section-title">Exportar Dados</div>
          <div class="ig-export-btns">
            <button class="ig-export-btn" id="ig-btn-csv">📊 CSV (Excel)</button>
            <button class="ig-export-btn" id="ig-btn-json">📋 JSON</button>
            <button class="ig-export-btn" id="ig-btn-copy">📝 Copiar</button>
            <button class="ig-export-btn" id="ig-btn-clear" style="color:#f87171;">🗑 Limpar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    bindUIEvents();
    makeDraggable(panel, document.getElementById('ig-drag-header'));
    extractPostMetadata();
  }

  function updatePostInfoCard() {
    const authorEl = document.getElementById('ig-info-author');
    const linkEl = document.getElementById('ig-info-link');
    const captionEl = document.getElementById('ig-info-caption');

    if (authorEl && state.postAuthor) {
      authorEl.textContent = `@${state.postAuthor}`;
    }
    if (linkEl) {
      linkEl.href = getCleanPostUrl();
      linkEl.textContent = `🔗 /p/${state.postShortcode || 'post'}`;
    }
    if (captionEl) {
      if (state.postCaption) {
        captionEl.textContent = state.postCaption;
      } else {
        captionEl.textContent = '(Sem legenda ou carregando...)';
      }
    }
  }

  function bindUIEvents() {
    // Presets
    document.querySelectorAll('.ig-preset-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.ig-preset-btn').forEach((b) => b.classList.remove('active'));
        e.target.classList.add('active');
        const val = parseInt(e.target.getAttribute('data-val'), 10);
        const input = document.getElementById('ig-limit-input');
        if (input) {
          input.value = val === 0 ? '' : val;
          input.placeholder = val === 0 ? 'Sem limite' : 'Qtd';
        }
        state.targetCount = val;
      });
    });

    // Limit input
    const limitInput = document.getElementById('ig-limit-input');
    if (limitInput) {
      limitInput.addEventListener('input', () => {
        document.querySelectorAll('.ig-preset-btn').forEach((b) => b.classList.remove('active'));
        const val = parseInt(limitInput.value, 10);
        state.targetCount = isNaN(val) || val <= 0 ? 0 : val;
      });
    }

    // Checkboxes
    const optCaption = document.getElementById('ig-opt-caption');
    if (optCaption) {
      optCaption.addEventListener('change', (e) => {
        state.includeCaption = e.target.checked;
      });
    }

    const optReplies = document.getElementById('ig-opt-replies');
    if (optReplies) {
      state.expandReplies = optReplies.checked;
      optReplies.addEventListener('change', (e) => {
        state.expandReplies = e.target.checked;
      });
    }

    // Action buttons
    document.getElementById('ig-btn-start').addEventListener('click', startScraper);
    document.getElementById('ig-btn-pause').addEventListener('click', pauseScraper);
    document.getElementById('ig-btn-stop').addEventListener('click', () =>
      stopScraper('Interrompido pelo usuário')
    );

    // Export buttons
    document.getElementById('ig-btn-csv').addEventListener('click', exportCSV);
    document.getElementById('ig-btn-json').addEventListener('click', exportJSON);
    document.getElementById('ig-btn-copy').addEventListener('click', copyToClipboard);
    document.getElementById('ig-btn-clear').addEventListener('click', clearCaptured);

    // Minimize & Close
    document.getElementById('ig-btn-minimize').addEventListener('click', togglePanel);
    document.getElementById('ig-btn-close').addEventListener('click', () => {
      document.getElementById('ig-scraper-panel').classList.add('hidden');
      document.getElementById('ig-scraper-launcher').style.display = 'flex';
    });

    // Preview accordion
    const toggle = document.getElementById('ig-preview-toggle');
    const list = document.getElementById('ig-preview-list');
    const arrow = document.getElementById('ig-preview-arrow');
    toggle.addEventListener('click', () => {
      if (list.style.display === 'none') {
        list.style.display = 'flex';
        arrow.textContent = '▾';
      } else {
        list.style.display = 'none';
        arrow.textContent = '▸';
      }
    });
  }

  function togglePanel() {
    const panel = document.getElementById('ig-scraper-panel');
    const launcher = document.getElementById('ig-scraper-launcher');
    if (panel.classList.contains('hidden')) {
      panel.classList.remove('hidden');
      launcher.style.display = 'none';
      extractPostMetadata();
    } else {
      panel.classList.add('hidden');
      launcher.style.display = 'flex';
    }
  }

  function setStatusBadge(type, text) {
    const badge = document.getElementById('ig-status-badge');
    if (!badge) return;
    badge.className = `ig-status-badge ${type}`;
    badge.textContent = text;
  }

  function updateStatusDetail(text) {
    const detail = document.getElementById('ig-status-detail');
    if (detail) detail.textContent = text;
  }

  function setButtonStates() {
    const btnStart = document.getElementById('ig-btn-start');
    const btnPause = document.getElementById('ig-btn-pause');
    const btnStop = document.getElementById('ig-btn-stop');

    if (state.isRunning && !state.isPaused) {
      btnStart.disabled = true;
      btnPause.disabled = false;
      btnStop.disabled = false;
    } else if (state.isPaused) {
      btnStart.disabled = false;
      btnStart.innerHTML = '▶ Continuar';
      btnPause.disabled = true;
      btnStop.disabled = false;
    } else {
      btnStart.disabled = false;
      btnStart.innerHTML = '▶ Iniciar';
      btnPause.disabled = true;
      btnStop.disabled = true;
    }
  }

  function updateUI() {
    const count = state.captured.size;
    const target = state.targetCount;

    let replyCount = 0;
    state.captured.forEach((c) => {
      if (c.isReply) replyCount++;
    });

    const countDisplay = document.getElementById('ig-count-display');
    if (countDisplay) {
      const replyLabel = replyCount > 0 ? ` (${replyCount} respostas)` : '';
      countDisplay.textContent =
        target > 0
          ? `${count} / ${target} capturados${replyLabel}`
          : `${count} capturados${replyLabel}`;
    }

    const launcherBadge = document.getElementById('ig-launcher-count');
    if (launcherBadge) {
      launcherBadge.textContent = count;
    }

    const bar = document.getElementById('ig-progress-bar');
    if (bar) {
      if (target > 0) {
        const pct = Math.min(100, Math.round((count / target) * 100));
        bar.style.width = `${pct}%`;
      } else {
        bar.style.width = count > 0 ? '100%' : '0%';
      }
    }
  }

  function addPreviewItem(c) {
    const list = document.getElementById('ig-preview-list');
    if (!list) return;

    const item = document.createElement('div');
    item.className = `ig-preview-item ${c.isReply ? 'ig-is-reply' : ''}`;
    item.innerHTML = `
      <div class="ig-preview-meta">
        <div>
          <a class="ig-preview-user" href="${c.userUrl}" target="_blank">@${c.username}</a>
          ${c.isReply ? '<span class="ig-reply-badge">Resposta</span>' : ''}
          ${c.isCaption ? '<span class="ig-caption-badge">Legenda</span>' : ''}
        </div>
        <span class="ig-preview-time">${c.timeAgo || ''}</span>
      </div>
      <div class="ig-preview-text">${escapeHTML(c.text)}</div>
    `;

    list.appendChild(item);
    list.scrollTop = list.scrollHeight;
  }

  function escapeHTML(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- DRAGGABLE HEADER ---
  function makeDraggable(element, handle) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = `${element.offsetTop - pos2}px`;
      element.style.left = `${element.offsetLeft - pos1}px`;
      element.style.bottom = 'auto';
      element.style.right = 'auto';
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  // --- INITIALIZE ---
  function init() {
    createUI();

    setInterval(() => {
      const code = getPostShortcode();
      if (code !== state.postShortcode) {
        state.postShortcode = code;
        state.postAuthor = '';
        state.postCaption = '';
        extractPostMetadata();
      }
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

  console.log('%c[IG Scraper v1.3] Ativado com suporte a Expansão de Respostas/Threads!', 'color:#a855f7; font-weight:bold; font-size:14px;');
})();
