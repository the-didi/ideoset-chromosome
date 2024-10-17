const path = require("path");
const fs = require("fs");
const ASSET_PATH = "assets/ideoset";

function caculateOpacity(arr) {
  if (arr.length <= 2 || arr[1].length == 2) {
    return 0.0;
  } else {
    return arr[1];
  }
}

function caculateType(arr) {
  if (arr.length === 1) {
    return "C";
  }
  const typeChr = arr[1][0];
  if (typeChr == "C") {
    return "CEN";
  } else if (typeChr == "N" || typeChr == "E") {
    return "ROUND";
  } else {
    return "BLOCK";
  }
}

function caculateHeight(arr) {
  if (arr.length == 1) {
    return 20.0;
  } else {
    return arr[arr.length - 1];
  }
}

async function generatorConfig(file, name, type) {
  let result = {};
  result["name"] = name;
  result["type"] = type;
  const originalLine = file.split("\n").filter((ele) => ele[1] == ":");
  let resultArr = [];
  let tmp = [];
  for (let i = 1; i < originalLine.length; i++) {
    let computedStrArr = originalLine[i]
      .split("")
      .filter((ele) => ele != "\r")
      .join("")
      .split("\t");
    tmp.push({
      name: computedStrArr[0].split(" ")[2],
      opacity: caculateOpacity(computedStrArr),
      height: caculateHeight(computedStrArr),
      type: caculateType(computedStrArr),
    });
    if (originalLine[i][0] == "E") {
      resultArr.push({
        name: computedStrArr[0].split(" ")[1],
        descBlocks: tmp,
      });
      tmp = [];
    }
  }
  result["standardBelt"] = resultArr;
  return result;
}

function analyze_chromosome_by_path(name) {
  return new Promise(async (resolve) => {
    const target_path = path.join(ASSET_PATH, name + ".ideoset");
    const content = await fs.readFileSync(target_path, "utf8");
    const entity = generatorConfig(content, name, "HUMAN");
    resolve(entity);
  });
}

module.exports = {
  analyze_chromosome_by_path,
};
