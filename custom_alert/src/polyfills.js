/* RxJS / Splunk compatibility fix */

if (typeof Symbol === 'function') {
  if (!Symbol.observable) {
    Symbol.observable = Symbol('observable');
  }
}

/* RxJS fallback key */
if (!('@@observable' in Object.prototype)) {
  Object.defineProperty(Object.prototype, '@@observable', {
    value: function () {
      return this;
    },
    writable: false,
    enumerable: false,
  });
}
