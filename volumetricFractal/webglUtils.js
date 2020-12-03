
function initCoords(gl, pid) {
	let coords = gl.getAttribLocation(pid, 'coords');
	let array = new Float32Array([-1,  3, -1, -1, 3, -1]);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

	gl.vertexAttribPointer(coords, 2 /*components per vertex */, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(coords);
}

function loadShaders(gl, pid) {
	shader(gl, pid, 'script[type="glsl/vertex"]', gl.VERTEX_SHADER);
	shader(gl, pid, '#main-fragment-shader', gl.FRAGMENT_SHADER);
	gl.linkProgram(pid);
	gl.useProgram(pid);
}

function shader(gl, pid, cssSelector, type) {
	let src = document.querySelector(cssSelector).innerText;
	if (type === gl.FRAGMENT_SHADER) {
		var commonSrc = document.getElementById('common-fragment-shader').innerText;
		src = commonSrc + src;
	}
	let sid = gl.createShader(type);
	gl.shaderSource(sid, src);
	gl.compileShader(sid);
	gl.attachShader(pid, sid);
}

function drawGraphics(gl, w, h) {
	gl.viewport(0, 0, w, h);
	gl.clearColor(0, 0, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function copyUniform(glFrom, glDestination, pidFrom, pidDestination, key) {
	var locationOfUniform = glFrom.getUniformLocation(pidFrom, key);
	var destinationOfUniform = glDestination.getUniformLocation(pidDestination, key);
	if (!locationOfUniform) {
		console.log('Weird.  Not found: ' + key + ', locationOfUniform: ', locationOfUniform);
	}
	var val = glFrom.getUniform(pidFrom, locationOfUniform);
	var uniformFunc;
	if (typeof val === 'boolean') {
		uniformFunc = glDestination.uniform1i;
	}
	else if (typeof val === 'number') {
		if (Math.floor(val) !== val || [
		'cReal', 'sphereRadiusSquared', 'peakSampleOpacity', 'planeCutValue', 
		'fractalIterationDelta', 'scale', 'ambientFactor', 'sphereRadiusWithPlaneLineSquared'
		].indexOf(key) !== -1)
			uniformFunc = glDestination.uniform1f;
		else
			uniformFunc = glDestination.uniform1i;
	}
	else if (val instanceof Float32Array) {
		if (val.length === 2)
			uniformFunc = glDestination.uniform2fv;
		else
			uniformFunc = glDestination.uniform3fv;
	}
	else {
		throw new Error('Unrecognized uniform type for: ', val);
	}
	uniformFunc.call(glDestination, destinationOfUniform, val);
}

function freeWebGLContext(gl) {
	// Free up the context, if the extension is supported.
	var ext = gl.getExtension('WEBGL_lose_context');
	if (typeof ext === 'object' && typeof ext.loseContext === 'function') {
		var extension = gl.getExtension('WEBGL_lose_context');
		if (extension)
			extension.loseContext();
	}
}