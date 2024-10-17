const { analyze_chromosome_by_path } = require("./caculate.js");
const { generator_svg_by_data } = require("./svg.js");
const ERROR_MSG_ENTITY = require("./errors.js");
const CHROMOSOME_CONFIG = {
  CHROMOSOME_OPTIONS: {
    Human300G: "assets/ideoset/Human300G.ideoset",
    Human400G: "assets/ideoset/Human400G.ideoset",
    Human550G: "assets/ideoset/Human550G.ideoset",
    Human700G: "assets/ideoset/Human700G.ideoset",
    Human850G: "assets/ideoset/Human850G.ideoset",
    Human300R: "assets/ideoset/Human300R.ideoset",
    Human400R: "assets/ideoset/Human400R.ideoset",
    Human550R: "assets/ideoset/Human550R.ideoset",
    Human700R: "assets/ideoset/Human700R.ideoset",
    Human850R: "assets/ideoset/Human850R.ideoset",
  },
};

class StandardChromosome {
  constructor(options = {}) {
    this.chromosome_name =
      CHROMOSOME_CONFIG["CHROMOSOME_OPTIONS"][options.name] || "Human300G";
    this.isLoading = true;
    this.__init__();
  }
  async __init__() {
    this.chromosome_entity = await analyze_chromosome_by_path(
      this.chromosome_name
    );
    this.isLoading = false;
  }
  // 生成哪一个染色体的SVG元素??
  generatorSVG(name) {
    if (this.isLoading) {
      throw new Error(ERROR_MSG_ENTITY["CHROMOSOME_IS_LOADING"]);
    }
    const svg_data = this.chromosome_entity.standardBelt.find(
      (ele) => ele.name === name
    );
    // 根据SVG_DATA 创建SVG元素
    return generator_svg_by_data(svg_data);
  }
}

const standard_chromosome = new StandardChromosome();

setTimeout(() => {
  console.log(standard_chromosome.generatorSVG("1"));
});

module.exports = {
  CHROMOSOME_CONFIG,
  StandardChromosome,
};
