function Promise(executor) {
  this.status = 'pending';
  this.data = undefined;
  this.resolveCallback = [];
  this.rejectCallback = [];

  const resolve = (value) => {
    if (this.status === 'pending') {
      this.status = 'resolved';
      this.data = value;
      this.resolveCallback.forEach((callback) => {
        callback(value);
      });
    }
  };

  function reject(reason) {
    if (this.status === 'pending') {
      this.status = 'rejected';
      this.data = reason;
      this.rejectCallback.forEach((callback) => {
        callback(reason);
      });
    }
  }

  return (function () {
    try {
      executor(reject, resolve);
    } catch (e) {
      reject(e);
    }
  })();
}

Promise.prototype.then = function (onResolved, onRejected) {
  onResolved = typeof onResolved === 'function' ? onResolved : function (value) { return value; };
  onRejected = typeof onRejected === 'function' ? onRejected : function (reason) { return reason; };
  let res = null;
  if (this.status === 'resolved') {
    res = new Promise((resolve, reject) => {
      try {
        const x = onResolved(this.data);
        if (x instanceof Promise) {
          x.then(resolve, reject);
        }
        resolve(x);
      } catch (e) {
        reject(e);
      }
    });
  }

  if (this.status === 'rejected') {
    const x = onRejected(this.data);
    res = new Promise((resolve, reject) => {
      try {
        if (x instanceof Promise) {
          x.then(resolve, reject);
        }
        resolve(x);
      } catch (e) {
        reject(x);
      }
    });
  }

  if (this.status === 'pending') {
    res = new Promise((resolve, reject) => {
      const x = onResolved(this.data);
      this.resolveCallback.push((value) => {
        try {
          if (x instanceof Promise) {
            x.then(resolve, reject);
          }
        } catch (e) {
          reject(e);
        }
      });
      this.rejectCallback.push((reason) => {
        try {
          const y = onRejected(this.data);
          if (y instanceof Promise) {
            y.then(resolve, reject);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  return res;
};

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
