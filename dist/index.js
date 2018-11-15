'use strict';

function Promise(executor) {
    var _this = this;

    this.status = 'pending';
    this.data = undefined;
    this.resolveCallback = [];
    this.rejectCallback = [];

    var resolve = function resolve(value) {
        if (_this.status === 'pending') {
            _this.status = 'resolved';
            _this.data = value;
            _this.resolveCallback.forEach(function (callback, i) {
                callback(value);
            });
        }
    };
    function reject(reason) {
        if (this.status === 'pending') {
            this.status = 'rejected';
            this.data = reason;
            this.rejectCallback.forEach(function (callback, i) {
                callback(reason);
            });
        }
    }

    return function () {
        try {
            executor(reject, resolve);
        } catch (e) {
            reject(e);
        }
    }();
}

Promise.prototype.then = function (resolved, rejected) {};