class Camera {
	constructor(gl, pid) {
		this.gl = gl;
		this.rotationRadius = 2.0
		this.rotationAngle = 0;
		this.positionY = 0;
		this.locationOfPosition = gl.getUniformLocation(pid, "position3D");
		this.locationOfViewRotation = gl.getUniformLocation(pid, "viewRotation");
	}
	
	addAngleAndRadius(da, dr) {
		this.rotationAngle += da;
		this.rotationRadius += dr;
	}

	setRotationAngle(newAngle) {
		var a = Math.PI + newAngle;
		this.gl.uniform2fv(this.locationOfViewRotation, [Math.cos(a), Math.sin(a)]);
		this.gl.uniform3fv(this.locationOfPosition, [this.rotationRadius * Math.sin(newAngle), this.positionY, this.rotationRadius * Math.cos(newAngle)]);
		this.rotationAngle = newAngle;
	}
	
	changed() {
		this.setRotationAngle(this.rotationAngle);
	}

	setPositionY(positionY) {
		this.positionY = positionY;
	}
}