chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["blocked", "enabled"], ({ blocked, enabled }) => {
    if (!Array.isArray(blocked)) {
      chrome.storage.local.set({ blocked: [] });
    }

    if (typeof enabled !== "boolean") {
      chrome.storage.local.set({ enabled: false });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  const url = changeInfo.pendingUrl || changeInfo.url;
  if (!url || !url.startsWith("http")) {
    return;
  }

  const hostname = new URL(url).hostname;

  chrome.storage.local.get(["blocked", "enabled"], ({ blocked, enabled }) => {
    if (enabled && blocked.find((domain) => hostname.includes(domain))) {
      chrome.tabs.remove(tabId);
    }
  });
});
