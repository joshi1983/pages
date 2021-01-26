function loadShader(gl, program, src, type) {
	let sid = gl.createShader(type);
	gl.shaderSource(sid, src);
	gl.compileShader(sid);
	var compiled = gl.getShaderParameter(sid, gl.COMPILE_STATUS);
	if (!compiled) {
		console.log('Shader compiled successfully: ' + compiled);
		var compilationLog = gl.getShaderInfoLog(sid);
		console.log('Shader compiler log: ' + compilationLog);
	}
	gl.attachShader(program, sid);
}