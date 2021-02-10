class MainCharacter {
	constructor(renderer) {
		this.renderer = renderer;
		this.renderer.addAnimatedObject(this);
		this.previousViewpoints = [];
		this.viewPointRecordInterval = 100;
		this.breath = new Breath();
	}

	_updateViewpoints(t) {
		if (typeof t !== 'number' || isNaN(t)) {
			throw new Error('A number is expected for t.  t = ' + t);
		}
		if (this.previousViewpoints.length === 0 ||
		t - this.previousViewpoints[this.previousViewpoints.length - 1].t > this.viewPointRecordInterval) {
			this.previousViewpoints = this.previousViewpoints.filter(function(timedViewpoint) {
				return t - timedViewpoint.t < 5000;
			});
			var position = this.renderer.getViewpoint();
			// add new point.
			this.previousViewpoints.push({
				't': t,
				'viewpoint': position
			});
		}
	}

	_getMovementSpeedPerSecond() {
		var sum = 0;
		var prevPosition = undefined;
		for (var p = 1; p < this.previousViewpoints.length; p++) {
			var vp = this.previousViewpoints[p].viewpoint;
			var prevPosition = this.previousViewpoints[p - 1].viewpoint;
			var squared = 0;
			for (var i = 0; i < 3; i++) {
				var delta = (vp[i] - prevPosition[i]);
				squared += delta * delta;
			}
			sum += Math.sqrt(squared) * p / (this.previousViewpoints.length * this.previousViewpoints.length);
		}
		return sum;
	}

	_getBreathRate() {
		var speed = 5000 * this._getMovementSpeedPerSecond();
		return Math.min(4, Math.max(1.5, speed));
	}

	updateAnimation() {
		var t = new Date().getTime();
		var delta = 0;
		var angle = 0;
		if (this.previousT !== undefined) {
			delta = t - this.previousT;
			var breathRate = this._getBreathRate();
			this.breath.setRate(breathRate * 1.2);
			angle = (this.previousAngle + delta * 0.003 * breathRate) % (Math.PI * 2);
		}
		this._updateViewpoints(t);
		var viewpoint = this.renderer.getViewpoint();
		viewpoint[1] = 0.0006 + 0.00003 * Math.sin(angle);
		this.previousAngle = angle;
		this.previousT = t;
		this.renderer.setViewpoint(viewpoint);
	}
}