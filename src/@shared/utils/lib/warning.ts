'use strict';

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

const __DEV__ = process.env.NODE_ENV !== 'production';

// tslint:disable: no-console
let warning = function _warning(condition: boolean, format: string, args?: any): void {
    const len = arguments.length;

    args = new Array(len > 2 ? len - 2 : 0);
    for (let key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    // if (format.length < 10 || (/^[s\W]*$/).test(format)) {
    //   throw new Error(
    //     'The warning format should be able to uniquely identify this ' +
    //     'warning. Please, use a more descriptive format than: ' + format
    //   );
    // }

    if (!condition) {
      let argIndex = 0;
      const message = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++]);
      
      /* eslint-disable no-console */
      if (typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      // tslint:disable-next-line:no-empty
      } catch(x) { }
    }
  };

if(!__DEV__) {
  // tslint:disable-next-line:no-empty
 warning = function _warning() {};
}

export default warning
