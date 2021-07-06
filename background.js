console.log('From BACKGROUND');

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    name: 'Jack',
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
    chrome.scripting.insertCSS({
      target: { tabId },
      files: ['./foreground.css']
    }).then(() => {
      console.log("INJECTED THE FOREGROUND STYLES");

      chrome.scripting.executeScript({
        target: { tabId },
        files: ['./foreground.js']
      }).then(() => {
        console.log("INJECTED THE FOREGROUND SCRIPT");

        // chrome.tabs.sendMessage(tabId, {
        //   message: 'change_name',
        //   payload: 'John'
        // });
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  }
});

// chrome.runtime.sendMessage();
// chrome.tabs.sendMessage();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'get_name') {
    chrome.storage.local.get('name', data => {
      if (chrome.runtime.lastError) {
        sendResponse({
          message: 'fail'
        });

        return;
      }
      sendResponse({
        message: 'success',
        payload: data.name,
      })
    });

    return true;
  } else if (request.message === 'change_name') {
    chrome.storage.local.set({
      name: request.payload
    }, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ message: 'fail' });
        return;
      }

      sendResponse({ message: 'success' });
    });

    return true;
  }
});
