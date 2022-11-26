
//spy on log
exports.foo = () => {
  console.log("console log was called");
  // console.log("console log was called2"); //err second time called
  console.warn("console warn was called");

  return;
}