Promise.All = function(promises){
    return new Promise((resolve,reject) => {
        if (promises instanceof Array !== true) {
            return reject(new TypeError('arguments must be Array'));
        }
        let resArr = [];
        let counter = 0;
        promises.forEach((promiseFunc,i) => {
            Promise.resolve(promiseFunc)
                .then((value) => {
                    counter++;
                    resArr[i] = value;
                    if ( counter === promises.length ) {
                        return resolve(resArr)
                    }
                }, (reason) => {
                    return reject(reason);
                })
        })
    })
}

const f1 = new Promise((resolve,reject) => {
    setTimeout(()=>resolve(1),3000);
});
// const f2 = Promise.reject('error');
const f3 = Promise.resolve(3);

Promise.All([f1,f3]).then(res => console.log(res));

// Promise.All([f1,f2,f3]).then(res => console.log(res))
// .catch(e => console.log(e));