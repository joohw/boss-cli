(() => {
  'use strict';

  if (self.origin !== 'https://www.zhipin.com') return;
  // A same-origin iframe can be embedded in an excluded top-level page.
  let topPath;
  try {
    topPath = top.location.pathname;
  } catch (error) {
    if (error.name === 'SecurityError') return;
    throw error;
  }
  if (/^\/web\/(?:user|passport)|^\/web\/common\/(?:403|nonsupport)\.html/i.test(topPath)) return;

  const sources = new WeakMap();
  const nativeToString = Function.prototype.toString;
  const objectToString = Object.prototype.toString;

  function replace(object, key, replacement, nativeName = key) {
    const descriptor = Object.getOwnPropertyDescriptor(object, key);
    sources.set(replacement, 'function ' + nativeName + '() { [native code] }');
    if ('value' in descriptor) {
      Object.defineProperty(replacement, 'name', { value: nativeName, configurable: true });
      Object.defineProperty(object, key, { ...descriptor, value: replacement });
    } else {
      Object.defineProperty(object, key, { ...descriptor, get: replacement });
    }
  }

  replace(Function.prototype, 'toString', function toString() {
    if (sources.has(this)) return sources.get(this);
    return Reflect.apply(nativeToString, this, []);
  });

  replace(Navigator.prototype, 'webdriver', function webdriver() { return false; }, 'get webdriver');

  const go = History.prototype.go;
  replace(History.prototype, 'back', function back() {});
  replace(History.prototype, 'forward', function forward() {});
  replace(History.prototype, 'go', function guardedGo(...args) {
    if (typeof args[0] === 'number' && args[0] < 0) return;
    return Reflect.apply(go, this, args);
  });

  replace(console, 'clear', function clear() {});
  for (const method of [
    'log', 'info', 'debug', 'warn', 'error', 'table', 'dir', 'dirxml', 'trace', 'group', 'groupCollapsed',
  ]) {
    const original = console[method];
    replace(console, method, function consoleWithScalarArguments(...args) {
      const values = args.map((value) => {
        if (value !== null && typeof value === 'object') return Reflect.apply(objectToString, value, []);
        if (typeof value === 'function') return '[Function]';
        return value;
      });
      return Reflect.apply(original, this, values);
    });
  }
})();
