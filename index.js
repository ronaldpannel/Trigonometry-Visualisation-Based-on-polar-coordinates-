/**@type{HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const chartCanvas = document.getElementById("chartCanvas");
const ctx = canvas.getContext("2d");
const chartCtx = chartCanvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
chartCanvas.width = 500;
chartCanvas.height = 100;

const offset = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};
const chartOffset = {
  x: chartCanvas.width / 2,
  y: chartCanvas.height / 2,
};
let theta = Math.PI / 4;
const c = 100;

const A = { x: 0, y: 0 };
const B = { x: Math.cos(theta) * c, y: Math.sin(theta) * c };
const C = { x: B.x, y: 0 };

ctx.translate(offset.x, offset.y);
chartCtx.translate(chartOffset.x, chartOffset.y);
const bOffset = canvas.getBoundingClientRect();

drawCoordinates(chartCtx, chartOffset);

document.onpointermove = (e) => {
  B.x = e.x - offset.x - bOffset.left;
  B.y = e.y - offset.y - bOffset.top;

  C.x = B.x;
  update();
};
document.onwheel = (e) => {
  theta -= toRad(Math.sin(e.deltaY) * 3);

  B.x = Math.cos(theta) * c;
  B.y = Math.sin(theta) * c;

  C.x = B.x;
  update();
};

update();
function update() {
  ctx.clearRect(-offset.x, -offset.y, canvas.width, canvas.height);

  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const tan = Math.tan(theta);

  const T = {
    x: Math.sin(cos) * Math.hypot(1, tan) * C,
    y: 0,
  };

  drawLine(A, B);
  drawText("1", average(A, B));
  drawLine(A, C, "blue");
  drawText("cos", average(A, C), "blue");
  drawLine(B, C, "red");
  drawText("sin", average(C, B), "red");
  drawLine(B, T, "magenta");
  drawText("tan", average(B, T), "magenta");

  drawText("0", A);

  drawText(
    "sin = " + sin.toFixed(2),
    {
      x: -offset.x / 2,
      y: offset.y * 0.7,
    },
    "red"
  );

  drawText(
    "cos = " + cos.toFixed(2),
    {
      x: -offset.x / 2,
      y: offset.y * 0.8,
    },
    "blue"
  );

  drawText(
    "tan  = " + tan.toFixed(2),
    {
      x: -offset.x / 2,
      y: offset.y * 0.9,
    },
    "magenta"
  );
  drawText(
    "0 = " +
      theta.toFixed(2) +
      " rad (" +
      Math.round(toDeg(theta)).toString().padStart(2, " ") +
      " deg)",
    { x: offset.x / 2, y: offset.y * 0.7 }
  );

  drawText("a = opposite", { x: -offset.x / 2, y: -offset.y * 0.8 }, "grey");
  drawText("b = adjacent", { x: -offset.x / 2, y: -offset.y * 0.7 }, "grey");
  drawText(
    "c = hypotenuse",
    { x: -offset.x / 2 + 10, y: -offset.y * 0.6 },
    "grey"
  );
  drawText("0 = theta", { x: -offset.x / 2 - 18, y: -offset.y * 0.5 }, "grey");
  drawText(`scroll wheel changes theta`, {
    x: -offset.x / 2 + 130,
    y: -offset.y * 0.9,
  });

  drawCoordinates(ctx, offset);
  ctx.beginPath();
  ctx.strokeStyle = " black";
  ctx.lineWidth = 2;
  ctx.arc(0, 0, c, 0, theta, theta < 0);
  ctx.stroke();
  const chartScaler = chartOffset.y * 0.5;

  drawPoint(
    {
      x: theta * chartScaler,
      y: sin * chartScaler,
    },
    2,
    "red"
  );
  drawPoint(
    {
      x: theta * chartScaler,
      y: cos * chartScaler,
    },
    2,
    "blue"
  );
  drawPoint(
    {
      x: theta * chartScaler,
      y: tan * chartScaler,
    },
    2,
    "magenta"
  );
}

function average(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: p1.y + p2.y / 2,
  };
}

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

function drawText(text, loc, color = "black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 18px Courier";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 10;
  ctx.strokeText(text, loc.x, loc.y);
  ctx.fillText(text, loc.x, loc.y);
}

function drawPoint(loc, size = 20, color = "black") {
  chartCtx.beginPath();
  chartCtx.fillStyle = color;
  chartCtx.arc(loc.x, loc.y, size / 2, 0, Math.PI * 2);
  chartCtx.fill();
}

function drawLine(p1, p2, color = "black") {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawCoordinates(ctx, offset) {
  ctx.beginPath();
  ctx.moveTo(-offset.x, 0);
  ctx.lineTo(canvas.width - offset.x, 0);
  ctx.moveTo(0, -offset.y);
  ctx.lineTo(0, canvas.height - offset.y);
  ctx.setLineDash([4, 2]);
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);
}
drawCoordinates(offset);
drawLine(A, B);
drawLine(A, C);
drawLine(B, C);
