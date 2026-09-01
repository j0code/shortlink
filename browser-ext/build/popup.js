// deno:https://jsr.io/@bpev/bext/1.4.2/utilities/predicates.ts
var BrowserType = /* @__PURE__ */ function(BrowserType2) {
  BrowserType2["DENO"] = "DENO";
  BrowserType2["CHROME"] = "CHROME";
  BrowserType2["FIREFOX"] = "FIREFOX";
  return BrowserType2;
}(BrowserType || {});
var { CHROME, DENO, FIREFOX } = BrowserType;
function isBrowser(toCheck) {
  let currentBrowser = CHROME;
  try {
    const userAgent = navigator?.userAgent || "";
    if (/firefox/i.test(userAgent)) {
      currentBrowser = FIREFOX;
    } else if (/deno/i.test(userAgent)) {
      currentBrowser = DENO;
    }
  } catch (_) {
  }
  if (!toCheck) currentBrowser;
  if (toCheck === CHROME && currentBrowser === CHROME) return true;
  if (toCheck === FIREFOX && currentBrowser === FIREFOX) return true;
  if (toCheck === DENO && currentBrowser === DENO) return true;
  return false;
}
function isChrome() {
  return isBrowser(CHROME);
}
function isDeno() {
  return isBrowser(DENO);
}
function isFirefox() {
  return isBrowser(FIREFOX);
}

// deno:https://jsr.io/@bpev/bext/1.4.2/mock_browser/main.ts
var listeners = {
  addListener: () => {
  },
  removeListener: () => {
  },
  hasListener: () => {
  }
};
var main_default = {
  permissions: {
    contains: () => {
    },
    request: () => {
    }
  },
  runtime: {
    onMessage: listeners,
    openOptionsPage: () => {
    },
    lastError: {
      message: ""
    }
  },
  storage: {
    sync: {
      get: () => {
      },
      set: () => {
      }
    }
  },
  tabs: {
    onUpdated: listeners,
    query: () => {
    },
    sendMessage: () => {
    }
  }
};

// deno:https://jsr.io/@bpev/bext/1.4.2/mod.ts
var browserAPI = globalThis.chrome;
if (isFirefox()) {
  browserAPI = globalThis.browser;
}
if (isDeno()) {
  browserAPI = main_default;
}
var mod_default = browserAPI;

// ../api/api.ts
var API = class {
  baseUrl;
  auth;
  constructor(baseUrl) {
    this.baseUrl = baseUrl, this.auth = null;
  }
  async login(id, password) {
    this.auth = `user ${id}:${await getKey(password)}`;
  }
  setToken(token) {
    this.auth = `token ${token}`;
  }
  async createUser(password) {
    const key = await getKey(password);
    return post(this.baseUrl, "/api/v0/users", this.auth, {
      key
    });
  }
  createShortlink(url, claim, expiresAt = null) {
    const expires_at = expiresAt ? expiresAt.toString() : null;
    return post(this.baseUrl, "/api/v0/shortlinks", this.auth, {
      url,
      claim,
      expires_at
    });
  }
};
function post(baseUrl, route, auth, payload) {
  console.log("payload", payload);
  const url = new URL(route, baseUrl);
  const headers = {
    "Content-Type": "application/json"
  };
  if (auth) {
    console.log("auth", auth);
    headers["Authorization"] = auth;
  }
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers
  }).then((res) => res.json());
}
async function getKey(password) {
  const pw = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("sha-256", pw);
  return new Uint8Array(digest).toHex();
}

// constants.ts
var BASE_URL = "http://localhost:3000";

// ../components/Footer.ts
function generateFooter(info) {
  return `
<footer>
	<a>${info.name} v${info.version}</a>
	<a>&lt;/&gt; with <3 by j0code</a>
	<a>${info.branch}/${info.commit.substring(0, 8)}</a>
</footer>
`.trim();
}

// ../client/src/copyable.ts
function installEventListeners() {
  const copyables = document.querySelectorAll(".copyable");
  copyables.forEach((copyable) => {
    if (copyable.tagName != "A") copyable.addEventListener("click", copyValue(copyable));
    copyable.addEventListener("keydown", copyValueOnKey(copyable));
    copyable.tabIndex = 0;
    copyable.title = "Press space to copy.";
  });
}
function copyValue(outputElem) {
  return (event) => {
    event.preventDefault();
    const value = "value" in outputElem ? outputElem.value : outputElem.innerText;
    navigator.clipboard.writeText(value);
  };
}
function copyValueOnKey(outputElem) {
  const cv = copyValue(outputElem);
  return (event) => {
    if (event.code == "Space") {
      cv(event);
    }
  };
}

// popup.ts
var footer = generateFooter({
  name: "shortlink",
  version: "0.0.1",
  branch: "ext",
  commit: isChrome() ? "chrome" : "firefox"
});
var api = new API(BASE_URL);
var tab = (await mod_default.tabs.query({
  active: true
}))[0];
var targetUrl = new URL(tab.url);
var body = document.body;
if ([
  "https:",
  "http:"
].includes(targetUrl.protocol)) {
  main();
} else {
  renderError("Unable to generate shortlink", "This page is privileged and therefore cannot be shortened.");
}
async function main() {
  const response = await api.createShortlink(targetUrl.href);
  if (!response.success) {
    renderError(response.error, response.details + "");
    return;
  }
  const shortlink = response.result;
  const url = new URL(shortlink.id, BASE_URL);
  const inspectUrl = new URL(shortlink.id, `${BASE_URL}/inspect/`);
  renderPage(`
<div class="divider"></div>
<label>
	Shortlink: <output name="shortlink" for="url" aria-live="polite" class="copyable">${url}</output>
</label>
<label>
	Shortlink ID: <output name="shortlinkId" for="url" aria-live="polite" class="copyable">${shortlink.id}</output>
</label>
<div class="divider"></div>
<button id="inspect">Inspect</button>
	`.trim());
  const button = document.querySelector("#inspect");
  button?.addEventListener("click", (event) => {
    event.preventDefault();
    mod_default.tabs.create({
      url: inspectUrl.href
    });
  });
  installEventListeners();
  navigator.clipboard.writeText(url.href);
}
function renderPage(content) {
  body.innerHTML = `
<div id="card">
	<h1>Shortlink</h1>
	<main>
		${content}
	</main>
	${footer}
</div>
	`.trim();
  const html = document.querySelector("html");
  const card = document.querySelector("#card");
  html.style.width = `${card.clientWidth}px`;
  html.style.height = `${card.clientHeight}px`;
}
function renderError(error, details) {
  renderPage(`
		<div id="error-info">
			<h3 id="error">${error}</h3>
			<p id="details">${details.replaceAll("\n", "<br>")}<p>
		</div>
	`.trim());
}
