console.log('From BACKGROUND');

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    name: 'Jack',
  });
});
