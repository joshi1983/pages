;(function() {
"use strict"
window.addEventListener("load", setupWebGL, false);

var gl, program, locationOfWidth, locationOfScale, locationOfOffsetX, locationOfOffsetY;

function setupWebGL (evt) {
  window.removeEventListener(evt.type, setupWebGL, false);
  if (!(gl = getRenderingContext()))
    return;

  var source = document.querySelector("#vertex-shader").innerHTML;
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader,source);
  gl.compileShader(vertexShader);
  source = document.querySelector("#fragment-shader").innerHTML
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader,source);
  gl.compileShader(fragmentShader);
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var linkErrLog = gl.getProgramInfoLog(program);
    cleanup();
    document.querySelector("p").innerHTML =
      "Shader program did not link successfully. "
      + "Error log: " + linkErrLog;
    return;
  }

  initializeAttributes();

  locationOfWidth = gl.getUniformLocation(program, "width");
  locationOfScale = gl.getUniformLocation(program, "scale");
  locationOfOffsetX = gl.getUniformLocation(program, "offsetX");
  locationOfOffsetY = gl.getUniformLocation(program, "offsetY");
  gl.useProgram(program);
  
  var canvas = document.querySelector("canvas");
  gl.uniform1f(locationOfWidth, canvas.clientWidth);
  
  gl.drawArrays(gl.POINTS, 0, 1);

    updateDisplay(1600);  
}

function showFinalMessage() {
    document.querySelector('.final-message').setAttribute('class', 'final-message show');
}

function updateDisplay(i) {
    if (i < 0) {
        cleanup();
        setTimeout(showFinalMessage, 1000);
        return;
    }
  var canvas = document.querySelector("canvas");
  gl.uniform1f(locationOfScale, 0.000000001 + 0.0035 * Math.pow(0.995, i));
  gl.uniform1f(locationOfOffsetX, 0.5875 + 0.9 * Math.pow(0.995, i));
  gl.uniform1f(locationOfOffsetY, 0.49 + 0.6 * Math.pow(0.994, i));
  
  gl.drawArrays(gl.POINTS, 0, 1);
  requestAnimationFrame(function() {updateDisplay(i - 1); });
}


var buffer;
function initializeAttributes() {
  gl.enableVertexAttribArray(0);
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
}

function cleanup() {
    gl.useProgram(null);
    if (buffer)
      gl.deleteBuffer(buffer);
    if (program)
      gl.deleteProgram(program);
}

function getRenderingContext() {
  var canvas = document.querySelector("canvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  var gl = canvas.getContext("webgl")
    || canvas.getContext("experimental-webgl");
  if (!gl) {
    var paragraph = document.querySelector("p");
    paragraph.innerHTML = "Failed to get WebGL context."
      + "Your browser or device may not support WebGL.";
    return null;
  }
  gl.viewport(0, 0,
    gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return gl;
}
})();
