//stub create file
exports.bar = async (fileName) => {
  await exports.createFile(fileName);
  let result = await callDB(fileName)

  return result;
}

exports.createFile = (fileName) => {
  console.log("------ in create file");

  // fake create file
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Fake file created");
      return Promise.resolve('done')
    })
  })
}

function callDB(fileName) {
  console.log("---- in call DB");

  //fake create file

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('fake db call');
      resolve('saved')
    }, 100)
  })
}