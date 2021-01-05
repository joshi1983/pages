class Centre {
	constructor(gl, pid, getWidth, getHeight, camera, circles, realtimeRenderer, scale, sphereRadius) {
		this.gl = gl;
		this.getWidth = getWidth;
		this.getHeight = getHeight;
		this.camera = camera;
		this.circles = circles;
		this.realtimeRenderer = realtimeRenderer;
		this.scale = scale;
		this.sphereRadius = sphereRadius;
		this.locationOfCentre = gl.getUniformLocation(pid, "centre");
	}

	// returns value to be used in shader's uniform.
	// In other words, this isn't returning pixel coordinates.
	// You need the multiply the values by pixelStretch to get the pixel coordinates.
	getCentre() {
	  var w = this.getWidth();
	  var h = this.getHeight();
	  var cy = h / 2;
	  var body = document.querySelector('body');
	  var bodyClass = body.class;
	  if (!bodyClass)
		bodyClass = '';

	  // if the settings are showing and it is more than 0.3 * h,
	  // look for a better cy.
	  if (bodyClass.indexOf('settings-collapsed') === -1 && this.sphereRadius !== undefined) {
		  var settings = document.getElementById('settings');
		  var settingsHeight = settings.clientHeight / this.realtimeRenderer.pixelStretch;
		  if (settingsHeight > 0.3 * h) {
			  	var r = this.sphereRadius.get();
				if (r < 0.9 * this.camera.rotationRadius && r < 0.5 * h) {
					r = this.circles.getRadiusFromSphereRadius(r, this.scale.get());
					var remainingHeight = h - settingsHeight;
					if (remainingHeight > r * 2) {
						cy = remainingHeight / 2;
					}
				}
		  }
	  }
	  return [w / 2, cy];
	}

	updateCentre() {
		var newCentre = this.getCentre();
		this.gl.uniform2fv(this.locationOfCentre, newCentre);
		this.mandelBrotDisplay.updateVisibility();
	}
}