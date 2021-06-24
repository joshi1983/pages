class Drawing {
	constructor() {
		this.canvas = document.querySelector('canvas');
		this.g = this.canvas.getContext('2d');
		this.droneImage = new Image();
		this.bladeSpeed = document.getElementById('blade-speed');
		this.elevation = document.getElementById('elevation');
		this.goalElevation = document.getElementById('goal-elevation');
		this.verticalVelocity = document.getElementById('vertical-velocity');
		this.verticalAcceleration = document.getElementById('vertical-acceleration');
		this.t = document.getElementById('t');
		this.droneImage.setAttribute('src', 'images/drone.png');
		var outer = this;
		function updateCanvasSize() {
			outer.canvas.removeAttribute('height');
			outer.canvas.removeAttribute('width');
			var bounds = outer.canvas.getBoundingClientRect();
			outer.canvas.setAttribute('width', Math.round(bounds.width));
			outer.canvas.setAttribute('height', Math.round(bounds.height));
		}
		window.addEventListener('resize', updateCanvasSize);
		updateCanvasSize();
		setTimeout(updateCanvasSize, 1000);
	}

	draw(a) {
		var w = this.canvas.getAttribute('width');
		var h = this.canvas.getAttribute('height');
		var simulatedH = Math.max(5, a.realWorld.elevation + 3);
		var verticalScale = h / simulatedH;
		this.g.fillStyle = '#05f';
		this.g.fillRect(0, 0, w, h);
		this.g.strokeStyle = '#fff';
		var y = (simulatedH - a.realWorld.elevation - 1) * verticalScale;
		var x = w * 0.2;
		this.g.fillStyle = '#080';
		this.g.fillRect(0, (simulatedH - 1) * verticalScale, w, h);

		// draw the goal elevation.
		var goalElevation = (simulatedH - a.controlState.goal.elevation - 1) * verticalScale;
		this.g.strokeStyle = '#fff';
		this.g.beginPath();
		this.g.moveTo(0, goalElevation);
		this.g.lineTo(w, goalElevation);
		this.g.closePath();
		this.g.stroke();
		
		this.g.beginPath();
		this.g.rect(x, y - verticalScale, verticalScale, verticalScale);
		this.g.stroke();

		this.g.drawImage(this.droneImage, x, y - verticalScale, verticalScale, verticalScale);

		this.elevation.innerText = a.realWorld.elevation.toFixed(2);
		this.bladeSpeed.innerText = a.controlState.bladeSpeed.toFixed(2);
		this.goalElevation.innerText = a.controlState.goal.elevation.toFixed(2);
		this.verticalVelocity.innerText = a.realWorld.verticalVelocity.toFixed(2);
		this.verticalAcceleration.innerText = a.realWorld.verticalAcceleration.toFixed(2);
		this.t.innerText = a.t.toFixed(2);
	}
}

