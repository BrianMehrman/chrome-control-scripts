const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

(async function() {
  async function launchChrome() {
    return await chromeLauncher.launch({
      chromeFlags: [
        '--disable-gpu',
        '--headless'
      ]
    });
  }
  const chrome = await launchChrome();
  const protocol = await CDP({
    port: chrome.port
  });

  // Code Snippets here

  const {
    DOM,
    Page,
    Emulation,
    Runtime
  } = protocol;

  await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);

  Page.navigate({
    url: 'https://en.wikipedia.org/wiki/SitePoint'
  });

  Page.loadEventFired(async() => {
    const script1 = "document.querySelector('p').textContent";
    // Evaluate script1
    const result = await Runtime.evaluate({
      expression: script1
    });

    console.log(result.result.value);

    protocol.close();
    chrome.kill();
  });
})();
