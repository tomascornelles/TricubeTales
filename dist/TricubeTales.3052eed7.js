// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"i4syP":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "496e5bc13052eed7";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"9f5IL":[function(require,module,exports,__globalThis) {
var _i18NJs = require("./i18n.js");
var _storeJs = require("./store.js");
let currentLang = 'en';
let character = null;
let isCreating = false;
let isEditingSheet = false;
const main = document.getElementById('main-content');
const modal = document.getElementById('dice-modal');
/** --- RENDERING LOGIC --- **/ function render() {
    if (!main) return;
    const t = (0, _i18NJs.translations)[currentLang];
    const chars = (0, _storeJs.Store).getAll();
    if (isCreating) renderCreator(t);
    else if (!character) renderList(chars, t);
    else isEditingSheet ? renderEditView(t) : renderReadView(t);
    document.getElementById('txt-title').innerText = t.title;
}
function renderList(chars, t) {
    const listHtml = chars.map((c)=>`
        <article style="padding: 1rem; margin-bottom: 1rem;">
            <div style="display:flex; justify-content: space-between; align-items:center">
                <a href="#" class="char-link" data-id="${c.id}">
                    <h4 style="margin:0">${c.name}</h4>
                    <small>${c.concept} (${t.traits[c.trait]})</small>
                </a>
                <button class="outline secondary" data-del="${c.id}" style="width:auto; padding:2px 10px; margin:0">\u{2715}</button>
            </div>
        </article>`).join('');
    main.innerHTML = `
        <section>
            <h2>${t.loadChar}</h2>
            ${listHtml || `<p>${t.noChars}</p>`}
            <button id="btn-to-creator" class="contrast" style="width:100%">${t.newCharTitle}</button>
        </section>`;
    main.querySelectorAll('.char-link').forEach((a)=>a.onclick = (e)=>{
            e.preventDefault();
            character = chars.find((c)=>c.id == e.currentTarget.dataset.id);
            render();
        });
    main.querySelectorAll('[data-del]').forEach((b)=>b.onclick = (e)=>{
            (0, _storeJs.Store).saveAll(chars.filter((c)=>c.id != e.target.dataset.del));
            render();
        });
    document.getElementById('btn-to-creator').onclick = ()=>{
        isCreating = true;
        render();
    };
}
function renderCreator(t) {
    const traitOpts = Object.entries(t.traits).map(([k, v])=>`<option value="${k}">${v}</option>`).join('');
    main.innerHTML = `
        <article>
            <h2>${t.newCharTitle}</h2>
            <form id="char-form">
                <label>${t.name} <input name="name" placeholder="${t.phName}" required></label>
                <label>${t.trait} <select name="trait">${traitOpts}</select></label>
                <label>${t.concept} <input name="concept" placeholder="${t.phConcept}" required></label>
                <label>${t.perk} <input name="perk" placeholder="${t.phPerk}" required></label>
                <label>${t.quirk} <input name="quirk" placeholder="${t.phQuirk}" required></label>
                <div class="grid"><button type="submit">${t.save}</button><button type="button" class="secondary outline" id="btn-cancel">${t.cancel}</button></div>
            </form>
        </article>`;
    document.getElementById('char-form').onsubmit = (e)=>{
        e.preventDefault();
        const fd = new FormData(e.target);
        character = (0, _storeJs.Store).addChar({
            ...Object.fromEntries(fd),
            karma: 3,
            resolve: 3,
            id: Date.now()
        });
        isCreating = false;
        render();
    };
    document.getElementById('btn-cancel').onclick = ()=>{
        isCreating = false;
        render();
    };
}
function renderReadView(t) {
    main.innerHTML = `
        <article>
            <header style="display:flex; justify-content:space-between; align-items:start;">
                <div>
                    <h2 style="margin:0">${character.name}</h2>
                    <p style="margin:0; opacity:0.8">${character.concept}</small>
                    <p style="margin:0"><small>${t.traits[character.trait].toUpperCase()} | P: ${character.perk} | Q: ${character.quirk}</small></p>
                </div>
                <div style="display:flex; gap:0.5rem">
                    <button class="outline" id="btn-edit-mode" style="width:auto; margin:0">\u{270F}\u{FE0F}</button>
                    <button class="outline" id="btn-back" style="width:auto; margin:0">${t.back}</button>
                </div>
            </header>
            <div class="grid-stats" style="margin: 1.5rem 0">
                <div class="stat-box">${t.karma}: <strong style="font-size:1.5rem">${character.karma}</strong></div>
                <div class="stat-box">${t.resolve}: <strong style="font-size:1.5rem">${character.resolve}</strong></div>
            </div>
            <footer><button id="btn-open-roll" style="width:100%">${t.rollBtn}</button></footer>
        </article>`;
    document.getElementById('btn-edit-mode').onclick = ()=>{
        isEditingSheet = true;
        render();
    };
    document.getElementById('btn-back').onclick = ()=>{
        character = null;
        render();
    };
    document.getElementById('btn-open-roll').onclick = ()=>openRollModal(t);
}
function renderEditView(t) {
    const traitOpts = Object.entries(t.traits).map(([k, v])=>`<option value="${k}" ${character.trait === k ? 'selected' : ''}>${v}</option>`).join('');
    main.innerHTML = `
        <article>
            <form id="edit-form">
                <h3>${t.edit}</h3>
                <label>${t.name} <input name="name" value="${character.name}" required></label>
                <div class="grid">
                    <label>${t.trait} <select name="trait">${traitOpts}</select></label>
                    <label>${t.concept} <input name="concept" value="${character.concept}" required></label>
                </div>
                <div class="grid">
                    <label>${t.perk} <input name="perk" value="${character.perk}"></label>
                    <label>${t.quirk} <input name="quirk" value="${character.quirk}"></label>
                </div>
                <div class="grid">
                    <label>${t.karma} <input type="number" name="karma" value="${character.karma}"></label>
                    <label>${t.resolve} <input type="number" name="resolve" value="${character.resolve}"></label>
                </div>
                <div class="grid">
                    <button type="submit">${t.update}</button>
                    <button type="button" class="secondary outline" id="btn-cancel-edit">${t.cancel}</button>
                </div>
            </form>
        </article>`;
    document.getElementById('edit-form').onsubmit = (e)=>{
        e.preventDefault();
        const fd = new FormData(e.target);
        const updated = Object.fromEntries(fd);
        character = {
            ...character,
            ...updated,
            karma: parseInt(updated.karma),
            resolve: parseInt(updated.resolve)
        };
        updateStore();
        isEditingSheet = false;
        render();
    };
    document.getElementById('btn-cancel-edit').onclick = ()=>{
        isEditingSheet = false;
        render();
    };
}
/** --- ROLL LOGIC --- **/ function openRollModal(t) {
    document.getElementById('txt-roll-title').innerText = t.rollBtn;
    document.getElementById('txt-label-trait').innerText = t.trait;
    document.getElementById('txt-label-diff').innerText = t.diffs[5].split(' ')[0];
    document.getElementById('txt-check-concept').innerText = t.checkConcept;
    document.getElementById('txt-check-perk').innerText = t.checkPerk;
    document.getElementById('txt-btn-roll').innerText = t.rollBtn;
    document.getElementById('modal-trait-select').innerHTML = Object.entries(t.traits).map(([k, v])=>`<option value="${k}" ${character.trait === k ? 'selected' : ''}>${v}</option>`).join('');
    document.getElementById('modal-diff-select').innerHTML = Object.entries(t.diffs).map(([k, v])=>`<option value="${k}">${v}</option>`).join('');
    modal.open = true;
}
document.getElementById('roll-form').onsubmit = (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const t = (0, _i18NJs.translations)[currentLang];
    const difficulty = parseInt(fd.get('difficulty'));
    const usePerk = fd.get('usePerk') === 'on';
    let dice = fd.get('trait') === character.trait.toLowerCase() ? 3 : 2;
    if (fd.get('useConcept') !== 'on') dice--;
    const rolls = Array.from({
        length: Math.max(1, dice)
    }, ()=>Math.floor(Math.random() * 6) + 1);
    const successCount = rolls.filter((v)=>v >= difficulty).length;
    const canQuirk = rolls.some((v)=>v === difficulty - 1) && character.karma > 0;
    document.getElementById('roll-output').classList.remove('hidden');
    document.getElementById('dice-values').innerText = rolls.join(' ');
    const act = document.getElementById('roll-actions');
    act.innerHTML = '';
    document.getElementById('roll-message').innerText = successCount > 0 ? successCount >= 2 ? t.exceptional : t.success : t.failure;
    if (usePerk) {
        if (successCount > 0) {
            addActBtn(t.gainKarma, ()=>{
                character.karma++;
                finish();
            });
            addActBtn(t.gainResolve, ()=>{
                character.resolve++;
                finish();
            });
        } else character.karma++;
    }
    if (canQuirk) addActBtn(t.useQuirk, ()=>{
        character.karma--;
        finish();
    }, "secondary");
    if (successCount === 0) {
        const loss = rolls.every((v)=>v === 1) ? 2 : 1;
        addActBtn(`${t.loseRes} (${loss})`, ()=>{
            character.resolve -= loss;
            finish();
        });
    }
    if (act.innerHTML === '') addActBtn("OK", finish);
};
function addActBtn(txt, cb, cls = "") {
    const b = document.createElement('button');
    b.innerText = txt;
    if (cls) b.className = cls;
    b.onclick = cb;
    document.getElementById('roll-actions').appendChild(b);
}
const updateStore = ()=>{
    const all = (0, _storeJs.Store).getAll();
    const i = all.findIndex((c)=>c.id === character.id);
    if (i !== -1) {
        all[i] = character;
        (0, _storeJs.Store).saveAll(all);
    }
};
const finish = ()=>{
    updateStore();
    render();
    modal.open = false;
    document.getElementById('roll-output').classList.add('hidden');
};
document.getElementById('lang-selector').onchange = (e)=>{
    currentLang = e.target.value;
    render();
};
document.getElementById('close-modal').onclick = ()=>modal.open = false;
document.addEventListener('DOMContentLoaded', render);

},{"./i18n.js":"lQCzu","./store.js":"9fXba"}],"lQCzu":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "translations", ()=>translations);
const translations = {
    en: {
        title: "Tricube Tales Solo",
        loadChar: "Your Characters",
        noChars: "No characters found.",
        newCharTitle: "New Character",
        save: "Create Character",
        update: "Save Changes",
        cancel: "Cancel",
        back: "Menu",
        edit: "Edit Character",
        name: "Name",
        concept: "Concept",
        trait: "Trait",
        perk: "Perk",
        quirk: "Quirk",
        karma: "Karma",
        resolve: "Resolve",
        rollBtn: "Roll Dice",
        phName: "Character Name",
        phConcept: "e.g. Space Bounty Hunter",
        phPerk: "e.g. Gadget Expert",
        phQuirk: "e.g. Wanted by the Empire",
        traits: {
            brawny: "Brawny",
            agile: "Agile",
            crafty: "Crafty"
        },
        diffs: {
            4: "Easy (4+)",
            5: "Standard (5+)",
            6: "Hard (6+)"
        },
        failure: "Failure",
        success: "Success!",
        exceptional: "Exceptional Success!",
        critical: "Critical Failure!",
        checkConcept: "Apply Concept (+1 die)",
        checkPerk: "Use Perk (Risk for Karma/Res)",
        useQuirk: "Use Quirk (-1 Diff, -1 Karma)",
        gainKarma: "Gain +1 Karma",
        gainResolve: "Gain +1 Resolve",
        loseRes: "Lose Resolve"
    },
    es: {
        title: "Tricube Tales Solo",
        loadChar: "Tus Personajes",
        noChars: "No hay personajes guardados.",
        newCharTitle: "Nuevo Personaje",
        save: "Crear Personaje",
        update: "Guardar Cambios",
        cancel: "Cancelar",
        back: "Men\xfa",
        edit: "Editar Personaje",
        name: "Nombre",
        concept: "Concepto",
        trait: "Rasgo",
        perk: "Ventaja",
        quirk: "Defecto",
        karma: "Karma",
        resolve: "Resoluci\xf3n",
        rollBtn: "Lanzar Dados",
        phName: "Nombre del personaje",
        phConcept: "ej. Cazarrecompensas Espacial",
        phPerk: "ej. Experto en Gadgets",
        phQuirk: "ej. Buscado por el Imperio",
        traits: {
            brawny: "Fuerte",
            agile: "\xc1gil",
            crafty: "Astuto"
        },
        diffs: {
            4: "F\xe1cil (4+)",
            5: "Est\xe1ndar (5+)",
            6: "Dif\xedcil (6+)"
        },
        failure: "Fallo",
        success: "\xa1\xc9xito!",
        exceptional: "\xa1\xc9xito Excepcional!",
        critical: "\xa1Fallo Cr\xedtico!",
        checkConcept: "Aplicar Concepto (+1 dado)",
        checkPerk: "Usar Ventaja (Riesgo por Karma/Res)",
        useQuirk: "Usar Defecto (-1 Dif, -1 Karma)",
        gainKarma: "Ganar +1 Karma",
        gainResolve: "Ganar +1 Resoluci\xf3n",
        loseRes: "Perder Resoluci\xf3n"
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"9fXba":[function(require,module,exports,__globalThis) {
/**
 * LocalStorage wrapper for multiple characters
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Store", ()=>Store);
const Store = {
    getAll: ()=>JSON.parse(localStorage.getItem('tt_collection') || '[]'),
    saveAll: (chars)=>localStorage.setItem('tt_collection', JSON.stringify(chars)),
    addChar: (char)=>{
        const chars = Store.getAll();
        char.id = Date.now(); // Unique ID
        chars.push(char);
        Store.saveAll(chars);
        return char;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["i4syP","9f5IL"], "9f5IL", "parcelRequire6fe2", {})

//# sourceMappingURL=TricubeTales.3052eed7.js.map
