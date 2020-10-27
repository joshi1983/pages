class LightDirection {
	constructor(gl, pid) {
		this.gl = gl;
		this.locationOfLightDirection = gl.getUniformLocation(pid, "lightDirection");
		this.lightDirectionX = document.getElementById('light-x');
		this.lightDirectionY = document.getElementById('light-y');
		this.lightDirectionZ = document.getElementById('light-z');
		var outer = this;
		[this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ].forEach(function(input) {
			input.addEventListener('input', function() {
				outer.lightDirectionChanged();
			});
		});
		this.lightDirectionChanged();
	}
	
	setX(newValue) {
		this.lightDirectionX.value = newValue;
		this.lightDirectionChanged();
	}

	setY(newValue) {
		this.lightDirectionY.value = newValue;
		this.lightDirectionChanged();
	}

	setZ(newValue) {
		this.lightDirectionZ.value = newValue;
		this.lightDirectionChanged();
	}

	getX() {
		return sanitizeFloat(this.lightDirectionX.value, 0);
	}

	getY() {
		return sanitizeFloat(this.lightDirectionY.value, 0);
	}

	getZ() {
		return sanitizeFloat(this.lightDirectionZ.value, 0);
	}

	lightDirectionChanged() {
		var x = this.getX();
		var y = this.getY();
		var z = this.getZ();
		var m = Math.sqrt(x * x + y * y + z * z);
		if (m === 0) {
			x = 1;
		}
		else {
			x /= m;
			y /= m;
			z /= m;
		}
		this.gl.uniform3fv(this.locationOfLightDirection, [x, y, z]);
	}
}