var jsdom = require("jsdom");
const fs = require("fs");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);

let document = dom.window.document;

function generator_svg_by_data(GENERATOR_DATA) {
  console.log(GENERATOR_DATA);

  const width = 20;

  const P = GENERATOR_DATA.descBlocks.filter((ele) => ele.name.startsWith("p"));
  const Q = GENERATOR_DATA.descBlocks.filter((ele) => ele.name.startsWith("q"));

  const PHeight = P.reduce(
    (a, b) => Math.max(a, Number.parseFloat(b.height)),
    -Infinity
  );
  const QHeight =
    Q.reduce((a, b) => Math.max(a, Number.parseFloat(b.height)), -Infinity) -
    2.25 -
    PHeight;
  const CHeight = 2.25;
  const height = PHeight + QHeight + CHeight;

  // 创建SVG容器
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // 创建两个裁剪区域
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const clipPaths = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "clipPath"
  );

  clipPaths.setAttribute("id", "clipPaths");

  // 创建顶部裁剪区域
  const clipPathTopRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  clipPathTopRect.setAttribute("x", 0);
  clipPathTopRect.setAttribute("y", 0);
  clipPathTopRect.setAttribute("width", width);
  clipPathTopRect.setAttribute("height", PHeight);
  clipPathTopRect.setAttribute("rx", 3);
  clipPathTopRect.setAttribute("rx", 3);

  // 创建中间着丝粒裁剪区域
  const clipPathCenterRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  clipPathCenterRect.setAttribute("x", 2.5);
  clipPathCenterRect.setAttribute("y", PHeight);
  clipPathCenterRect.setAttribute("height", CHeight);
  clipPathCenterRect.setAttribute("width", width - 5);
  // clipPathCenterRect.setAttribute("rx", 0.1);
  // clipPathCenterRect.setAttribute("ry", 0.1);

  // 创建底部裁剪区域
  const clipPathBottomRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  clipPathBottomRect.setAttribute("x", 0);
  clipPathBottomRect.setAttribute("y", PHeight + CHeight);
  clipPathBottomRect.setAttribute("height", QHeight);
  clipPathBottomRect.setAttribute("width", width);
  clipPathBottomRect.setAttribute("rx", 3);
  clipPathBottomRect.setAttribute("ry", 3);
  clipPaths.appendChild(clipPathTopRect);
  clipPaths.appendChild(clipPathBottomRect);
  clipPaths.appendChild(clipPathCenterRect);

  // 创建背景
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", 0);
  rect.setAttribute("y", 0);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", "rgb(240, 240, 240)");

  const P_G = document.createElementNS("http://www.w3.org/2000/svg", "g");
  let prevHeight = 0;

  // 设置中心杂带
  const centerHeight = Q[0].height - P[P.length - 1].height;
  const crect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  crect.setAttribute("x", 0);
  crect.setAttribute("y", P[P.length - 1].height);
  crect.setAttribute("width", width);
  crect.setAttribute("height", centerHeight);
  crect.setAttribute("fill", "url(#gradientBg)");
  // 创建上方P带
  for (let i = 0; i < P.length; i++) {
    const height = P[i].height - prevHeight;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", 0);
    rect.setAttribute("y", prevHeight);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    if (P[i].type === "BLOCK") {
      rect.setAttribute("fill", `rgba(0,0,0,${P[i].opacity})`);
    } else {
      rect.setAttribute("fill", `url(#gradientBgR)`);
    }
    P_G.append(rect);
    prevHeight = P[i].height;
  }
  const Q_G = document.createElementNS("http://www.w3.org/2000/svg", "g");
  prevHeight = Q[0].height;
  for (let i = 1; i < Q.length; i++) {
    const height = Q[i].height - prevHeight;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", 0);
    rect.setAttribute("y", prevHeight);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    // rect.setAttribute("fill", `rgba(0,0,0,${Q[i].opacity})`);
    if (Q[i].type === "BLOCK") {
      rect.setAttribute("fill", `rgba(0,0,0,${Q[i].opacity})`);
    } else {
      rect.setAttribute("fill", `url(#gradientBgR)`);
    }
    Q_G.append(rect);
    prevHeight = Q[i].height;
  }
  const defbkg = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const smallGrid = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  smallGrid.setAttribute("id", "smallGrid");
  smallGrid.setAttribute("width", "1");
  smallGrid.setAttribute("height", "1");
  smallGrid.setAttribute("patternUnits", "userSpaceOnUse");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 8 0 L 0 0");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "black");
  path.setAttribute("stroke-width", "0.5");
  smallGrid.appendChild(path);
  const gradientBg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  gradientBg.setAttribute("id", "gradientBg");
  gradientBg.setAttribute("width", "80");
  gradientBg.setAttribute("height", "80");
  gradientBg.setAttribute("patternUnits", "userSpaceOnUse");
  gradientBg.setAttribute("patternTransform", "rotate(-45)");
  const rect1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect1.setAttribute("width", "80");
  rect1.setAttribute("height", "80");
  rect1.setAttribute("fill", "url(#smallGrid)");
  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  path1.setAttribute("d", "M 80 0 L 0 0 0 80");
  path1.setAttribute("fill", "none");
  gradientBg.appendChild(rect1);
  gradientBg.appendChild(path1);
  defbkg.appendChild(smallGrid);
  defbkg.appendChild(gradientBg);

  const defbkgR = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "defs"
  );
  const smallGridR = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  smallGridR.setAttribute("id", "smallGridR");
  smallGridR.setAttribute("width", "1");
  smallGridR.setAttribute("height", "1");
  smallGridR.setAttribute("patternUnits", "userSpaceOnUse");
  const pathR = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathR.setAttribute("d", "M 8 0 L 0 0");
  pathR.setAttribute("fill", "none");
  pathR.setAttribute("stroke", "black");
  pathR.setAttribute("stroke-width", "0.5");
  smallGridR.appendChild(pathR);
  const gradientBgR = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  gradientBgR.setAttribute("id", "gradientBgR");
  gradientBgR.setAttribute("width", "80");
  gradientBgR.setAttribute("height", "80");
  gradientBgR.setAttribute("patternUnits", "userSpaceOnUse");
  gradientBgR.setAttribute("patternTransform", "rotate(45)");
  const rect1r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect1r.setAttribute("width", "80");
  rect1r.setAttribute("height", "80");
  rect1r.setAttribute("fill", "url(#smallGridR)");
  const path1r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  path1r.setAttribute("d", "M 80 0 L 0 0 0 80");
  path1r.setAttribute("fill", "none");
  gradientBgR.appendChild(rect1r);
  gradientBgR.appendChild(path1r);
  defbkgR.appendChild(smallGridR);
  defbkgR.appendChild(gradientBgR);

  // 创建裁剪组
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.appendChild(rect);
  group.appendChild(P_G);
  group.appendChild(Q_G);
  group.appendChild(crect);
  group.setAttribute("clip-path", "url(#clipPaths)");
  svg.appendChild(defbkg);
  svg.appendChild(defbkgR);
  svg.appendChild(group);
  svg.appendChild(defs);
  defs.appendChild(clipPaths);
  fs.writeFileSync("examples/out.svg", svg.outerHTML);
  return svg.outerHTML;
}

module.exports = {
  generator_svg_by_data,
};
