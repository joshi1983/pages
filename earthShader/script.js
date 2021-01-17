document.addEventListener('DOMContentLoaded', function() {
	var canvas = document.querySelector('canvas');
	var gl = canvas.getContext('webgl');
	var program = gl.createProgram();
	loadShaders();
  	initCoords();
	var textureInfo = loadTexture(gl, textureDataURL);
	var texture = textureInfo.texture;
	var locationOfSurfaceSampler = gl.getUniformLocation(program, 'surfaceSampler');
	var locationOfCloudSampler = gl.getUniformLocation(program, 'cloudSampler');
	var viewport;
	var settings = new SettingsUI();

	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);

	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(locationOfSurfaceSampler, 0);
	
	function loadCloudTexture() {
		gl.activeTexture(gl.TEXTURE1);
		var cloudInfo = loadTexture(gl, cloudDataURL);
		var cloudTexture = cloudInfo.texture;

		// Bind the texture to texture unit 0
		gl.bindTexture(gl.TEXTURE_2D, cloudTexture);
		gl.uniform1i(locationOfCloudSampler, 1);
		return cloudInfo.promise;
	}

	function initCoords() {
		let position = gl.getAttribLocation(program, 'position');
		let array = new Float32Array([-1,  3, -1, -1, 3, -1]);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

		gl.vertexAttribPointer(position, 2 /*components per vertex */, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(position);
	}

	function loadShaders() {
		loadShader('x-shader/x-vertex', gl.VERTEX_SHADER);
		loadShader('x-shader/x-fragment', gl.FRAGMENT_SHADER);
		gl.linkProgram(program);
		gl.useProgram(program);
	}

	function loadShader(scriptType, shaderType) {
		var script = document.querySelector('script[type="' + scriptType + '"]');
		var src = script.innerText;
		let sid = gl.createShader(shaderType);
		gl.shaderSource(sid, src);
		gl.compileShader(sid);
		gl.attachShader(program, sid);
	}
	
	textureInfo.promise.then(function() {
		loadCloudTexture().then(function() {
			var viewport = new Viewport(gl, program, canvas);
			new ViewPoint(gl, program, viewport);
			new Lighting(gl, program, viewport);
			new OverallBrightness(gl, program, viewport);
			new SurfaceRotation(gl, program, viewport);
		});
	});
});