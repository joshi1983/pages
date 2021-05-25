class Animation
{
	constructor() {
		this.maxT = 1000;
	}

	getPropertiesForTime(t) 
	{
		var maxBladeAngle = this.maxT * 100;
		return {
			'uiSettings': {
				'yaw':  getCurveValue([
					{'x': 0, 'y': 90},
					{'x': this.maxT * 0.1, 'y': 90},
					{'x': this.maxT * 0.2, 'y': 92},
					{'x': this.maxT * 0.8, 'y': 109},
					{'x': this.maxT * 0.9, 'y': 110},
					{'x': this.maxT, 'y': 110},
				], t),
				'camera-pitch': getCurveValue([
					{'x': 0, 'y': 0},
					{'x': this.maxT * 0.1, 'y': 0},
					{'x': this.maxT * 0.2, 'y': 2},
					{'x': this.maxT * 0.3, 'y': 16},
					{'x': this.maxT * 0.5, 'y': 40},
					{'x': this.maxT * 0.7, 'y': 16},
					{'x': this.maxT * 0.8, 'y': 2},
					{'x': this.maxT * 0.9, 'y': 0},
					{'x': this.maxT, 'y': 0},
				], t),
				'camera-z': getCurveValue([
					{'x': 0, 'y': 0},
					{'x': this.maxT * 0.1, 'y': 0},
					{'x': this.maxT * 0.2, 'y': -0.5},
					{'x': this.maxT * 0.5, 'y': -2},
					{'x': this.maxT * 0.8, 'y': -0.5},
					{'x': this.maxT * 0.9, 'y': 0},
					{'x': this.maxT, 'y': 0},
				], t),
				'x': -4 + getCurveValue([
					{'x': 0, 'y': 0},
					{'x': this.maxT * 0.1, 'y': 0},
					{'x': this.maxT * 0.2, 'y': 1},
					{'x': this.maxT * 0.3, 'y': 8},
					{'x': this.maxT * 0.5, 'y': 20},
					{'x': this.maxT * 0.7, 'y': 8},
					{'x': this.maxT * 0.8, 'y': 1},
					{'x': this.maxT * 0.9, 'y': 0},
					{'x': this.maxT, 'y': 0},
				], t),
				'y': getCurveValue([
					{'x': 0, 'y': 0},
					{'x': this.maxT * 0.1, 'y': 0},
					{'x': this.maxT * 0.2, 'y': 11},
					{'x': this.maxT * 0.3, 'y': 20},
					{'x': this.maxT * 0.7, 'y': 20},
					{'x': this.maxT * 0.8, 'y': 11},
					{'x': this.maxT * 0.9, 'y': 0},
					{'x': this.maxT, 'y': 0},
				], t),
				'blade-angle': getCurveValue([
					{'x': 0, 'y': 0},
					{'x': this.maxT * 0.1, 'y': maxBladeAngle * 0.05},
					{'x': this.maxT * 0.2, 'y': maxBladeAngle * 0.19},
					{'x': this.maxT * 0.5, 'y': maxBladeAngle * 0.6},
					{'x': this.maxT * 0.8, 'y': maxBladeAngle * 0.85},
					{'x': this.maxT * 0.9, 'y': maxBladeAngle * 0.94},
					{'x': this.maxT, 'y': maxBladeAngle},
				], t)
			}
		};
	}
	
	getMaxTime() {
		return this.maxT;
	}
}