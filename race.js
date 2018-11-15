Promise.Race = (promises)=>{
    return new Promise((resolve,reject) =>{
        if (promises instanceof Array !== true) {
            reject(new TypeError('args must be Array'));
        }
        promises.forEach((promiseFuc,i) => {
            Promise.resolve(promiseFuc)
                .then((res) => resolve(res),
                    (res)=>reject(res))
        })
    })
}


const f1 = new Promise((resolve,reject) => {
    setTimeout(()=>resolve(1),2000)
})
const f2 = new Promise((resolve,reject) => {
    setTimeout(()=>resolve(2),1000)
})

Promise.Race([f1,f2]).then(res => console.log(res))
    .catch(e => console.log(e));