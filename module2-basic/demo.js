exports.add = (a, b) => {
  return a + b;
}

exports.addCallBack = (a, b, callback) => {
  setTimeout(() => {
    return callback(null, a + b)
  }, 500)
}

exports.addPromise = (a,b) => {
  // return Promise.reject(new Error("fake"))
  return Promise.resolve(1+2)
}