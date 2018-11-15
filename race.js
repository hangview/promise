Promise.Race = promises => new Promise((resolve, reject) => {
  if (promises instanceof Array !== true) {
    reject(new TypeError('args must be Array'));
  }
  promises.forEach((promiseFuc) => {
    Promise.resolve(promiseFuc)
      .then(res => resolve(res),
        res => reject(res));
  });
});

const f1 = new Promise((resolve) => {
  setTimeout(() => resolve(1), 2000);
});
const f2 = new Promise((resolve) => {
  setTimeout(() => resolve(2), 1000);
});

Promise.prototype.finally = function (callback) {
  console.log('finally function');
  return this.then(
    value => Promise.resolve(callback()).then(() => value),
    reason => Promise.resolve(callback()).then(() => { throw reason; })
  );
};


Promise.Race([ f1, f2 ]).then(res => console.log(res))
  .catch(e => console.log(e))
  .finally(() => console.log('finally'));
