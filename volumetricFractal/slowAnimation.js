class Animation {
	getDefaultProperties(deltaT) {
		var result = {
			'uiSettings': {
				'lightDirectionX': -0.1808,
				'lightDirectionY': 0.9151,
				'lightDirectionZ': 0.2093,
				'sphereRadius': getCurveValue([
					{'x': 0, 'y': 3, 'ignorePreviousSlope': true},
					{'x': 7149, 'y': 3, 'ignorePreviousSlope': true},
					{'x': 7150, 'y': 6, 'ignorePreviousSlope': true},
					{'x': 35160, 'y': 6, 'ignorePreviousSlope': true},
					{'x': 35161, 'y': 3, 'ignorePreviousSlope': true},
					{'x': 60000, 'y': 6},
					{'x': 69050, 'y': 15, 'ignorePreviousSlope': true},
					{'x': 70000, 'y': 15, 'ignorePreviousSlope': true},
					{'x': 81040, 'y': 15, 'ignorePreviousSlope': true}
					], deltaT),
				'cReal': getCurveValue([
					{'x': 0, 'y': -1.63, 'ignorePreviousSlope': true},
					{'x': 10000, 'y': 0},
					{'x': 14000, 'y': 0.34},
					{'x': 15000, 'y': 0.34},
					{'x': 25000, 'y': 0.35},
					{'x': 38000, 'y': 0.35},
					{'x': 40000, 'y': 0.32},
					{'x': 55000, 'y': 0.2, 'ignorePreviousSlope': true},
					{'x': 69049.99, 'y': 0.2, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 0.34, 'ignorePreviousSlope': true},
					{'x': 81040, 'y': 0.34, 'ignorePreviousSlope': true}
					], deltaT),
				'rotationAngle': getCurveValue([
					{'x': 0, 'y': 0},
					{'x': 5000, 'y': 0.2},
					{'x': 15000, 'y': 1.3},
					{'x': 20000, 'y': 2.5},
					{'x': 29000, 'y': 6},
					{'x': 33000, 'y': 7.6},
					{'x': 35400, 'y': 2.55 * Math.PI},
					{'x': 38000, 'y': 2.52 * Math.PI},
					{'x': 45000, 'y': 2.35 * Math.PI},
					{'x': 52800, 'y': 1.27 * Math.PI},
					{'x': 55000, 'y': 0.99 * Math.PI},
					{'x': 65000, 'y': 0.9280643189806786 * Math.PI},
					{'x': 69048, 'y': 0.9280643189806786 * Math.PI, 'ignorePreviousSlope': true},
					{'x': 69049, 'y': 0, 'ignorePreviousSlope': true},
					{'x': 81040, 'y': 0, 'ignorePreviousSlope': true},
					{'x': 91000, 'y': 0},
					{'x': 92000, 'y': Math.PI * 0.08},
					{'x': 93050, 'y': Math.PI * 0.25}
				], deltaT),
				'rotationRadius': getCurveValue([
					{'x': 0, 'y': 5, 'ignorePreviousSlope': true},
					{'x': 12000, 'y': 2},
					{'x': 13200, 'y': 1.85},
					{'x': 15500, 'y': 1.84},
					{'x': 29000, 'y': 1.282},
					{'x': 32000, 'y': 1.13},
					{'x': 35000, 'y': 0.8},
					{'x': 38000, 'y': 0.3},
					{'x': 40000, 'y': 0.1},
					{'x': 43000, 'y': 0},
					{'x': 55000, 'y': 0},
					{'x': 65000, 'y': -2.5},
					{'x': 69049.9, 'y': -5.5, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 5.5, 'ignorePreviousSlope': true},
					{'x': 81040, 'y': -2.5, 'ignorePreviousSlope': true},
					{'x': 91050, 'y': 1.1},
					{'x': 93050, 'y': 1.458, 'ignorePreviousSlope': true},
					{'x': 105050, 'y': 1.458, 'ignorePreviousSlope': true},
					], deltaT),
				'planeCutValue': getCurveValue([
					{'x': 0, 'y': 5, 'ignorePreviousSlope': true},
					{'x': 30000, 'y': 5},
					{'x': 69049.9, 'y': 5, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 4, 'ignorePreviousSlope': true},
					{'x': 81040, 'y': -4, 'ignorePreviousSlope': true},
					{'x': 93050, 'y': 0.9, 'ignorePreviousSlope': true},
					{'x': 105050, 'y': -1.6, 'ignorePreviousSlope': true},
					{'x': 117050, 'y': 1.6, 'ignorePreviousSlope': true},
					], deltaT),
				'positionY': getCurveValue([
					{'x': 0, 'y': 0, 'ignorePreviousSlope': true},
					{'x': 29000, 'y': 0},
					{'x': 31000, 'y': 0.011},
					{'x': 34000, 'y': 0.11},
					{'x': 36500, 'y': 0.4},
					{'x': 38000, 'y': 0.75},
					{'x': 40000, 'y': 1.085},
					{'x': 41400, 'y': 1.12},
					{'x': 55000, 'y': 1.13},
					{'x': 58500, 'y': 1.182},
					{'x': 65000, 'y': 1.5},
					{'x': 69049.9, 'y': 2.2, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 0, 'ignorePreviousSlope': true},
					{'x': 81040, 'y': 0}
					], deltaT),
				'peakOpacity': getCurveValue([
					{'x': 0, 'y': 0.1, 'ignorePreviousSlope': true},
					{'x': 10000, 'y': 1.8},
					{'x': 15000, 'y': 2.6},
					{'x': 29000, 'y': 3},
					{'x': 33000, 'y': 2.3},
					{'x': 35000, 'y': 2},
					{'x': 36500, 'y': 2},
					{'x': 38000, 'y': 2.3},
					{'x': 42000, 'y': 3},
					{'x': 55000, 'y': 3},
					{'x': 65000, 'y': 15.0, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 15.0, 'ignorePreviousSlope': true},
					{'x': 81040, 'y': 15.0, 'ignorePreviousSlope': true},
					{'x': 90000, 'y': 3.5},
					{'x': 93050, 'y': 2.2},
					{'x': 105050, 'y': 10, 'ignorePreviousSlope': true},
					{'x': 117049.9, 'y': 2.5, 'ignorePreviousSlope': true},
					{'x': 117050, 'y': 2.5, 'ignorePreviousSlope': true},
					{'x': 130000, 'y': 1.8},
					{'x': 141050, 'y': 0.3},
					], deltaT),
				'ambient': getCurveValue([
					{'x': 0, 'y': 0.05},
					{'x': 45000, 'y': 0.05},
					{'x': 50000, 'y': 0.3},
					{'x': 55000, 'y': 1.0, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 1.0},
					{'x': 81040, 'y': 1.0},
					{'x': 117050, 'y': 1.0},
					{'x': 117500, 'y': 0.8695},
					{'x': 120000, 'y': 0.1},
					{'x': 122000, 'y': 0.05},
					{'x': 129050, 'y': 0.0},
				], deltaT),
				'scaleFactor': getCurveValue([
					{'x': 0, 'y': 1},
					{'x': 45000, 'y': 0.73},
					{'x': 50000, 'y': 0.7},
					{'x': 69049.9, 'y': 0.7, 'ignorePreviousSlope': true},
					{'x': 69050, 'y': 1, 'ignorePreviousSlope': true},
					{'x': 81040, 'y': 1},
				], deltaT),
				'displayMode': 1,
				'lineThicknessFactor': 0.0005,
				'isShowingCircumference': 1
			}
		};
		if (deltaT < 105050)
			result.uiSettings.planeCutAxis = 3;
		else {
			result.uiSettings.planeCutAxis = 1;
		}
		return result;
	}

	getIntroProperties(deltaT) {
		return {
			'uiSettings': {
				'maxIterations': 75,
				'isShowingCircumference': 0
			}
		};
	}
	
	getHotBrightColourProperties(deltaT) {
		deltaT -= 15000;
		return {
			'uiSettings': {
			}
		};
	}
	
	startRiseUp(deltaT) {
		deltaT -= 29000;
		return {
			'uiSettings': {
			}
		};
	}

	finishRiseUp(deltaT) {
		deltaT -= 35000;
		return {
			'uiSettings': {
			}
		};
	}
	
	startPeakView(deltaT) {
		deltaT -= 38000;
		return {
			'uiSettings': {
			}
		};
	}

	peakRotation(deltaT) {
		deltaT -= 45000;
		return {
			'uiSettings': {
			}
		};
	}
	
	toTheEdge(deltaT) {
		deltaT -= 55000;
		return {
			'uiSettings': {
			}
		};
	}
	
	cutFromTheEdge(deltaT) {
		deltaT -= 81050;
		return {
			'uiSettings': {
				'displayMode': DisplayMode.PLANE_CUT
			}
		};
	}
	
	volumetricCutFromTheEdge(deltaT) {
		deltaT -= 69050;
		return {
			'uiSettings': {
				'displayMode': DisplayMode.MAX_CUT_VOLUME
			}
		};
	}
	
	startVolumetricCut(deltaT) {
		deltaT -= 93050;
		return {
			'uiSettings': {
				'displayMode': 3 // cut MAX
			}
		};
	}
	
	volumetricCutY(deltaT) {
		deltaT -= 93050;
		return {
			'uiSettings': {
				'displayMode': DisplayMode.MAX_CUT_VOLUME,
				'planeCutAxis': 2
			}
		};
	}
	
	rotatingCutY(deltaT) {
		deltaT -= 105050;
		return {
			'uiSettings': {
				'displayMode': DisplayMode.PLANE_CUT,
				'planeCutAxis': 2
			}
		};
	}
	
	lightSourceMovement(deltaT) {
		deltaT -= 105050;
		var angle = deltaT * 0.0005 + 7.125;
		var angle2 = angle - Math.PI * 0.5;
		return {
			'uiSettings': {
				'rotationAngle': angle,
				'displayMode': DisplayMode.DEFAULT,
				'lightDirectionY': 0.5,
				'lightDirectionX': Math.sin(angle2),
				'lightDirectionZ': Math.cos(angle2)
			}
		};
	}
	
	_deepCopy(o1, o2) {
		for (var key in o2) {
			if (o1[key] === undefined)
				o1[key] = o2[key];
			else if (typeof o2[key] === 'object') {
				this._deepCopy(o1[key], o2[key]);
			}
			else {
				o1[key] = o2[key];
			}
		}
	}
	
	getPropertiesForTime(deltaT) {
		var result = this.getDefaultProperties(deltaT);
		if (deltaT < 15 * 1000) {
			this._deepCopy(result, this.getIntroProperties(deltaT));
		}
		else if (deltaT < 29 * 1000) {
			this._deepCopy(result, this.getHotBrightColourProperties(deltaT));
		}
		else if (deltaT < 35 * 1000) {
			this._deepCopy(result, this.startRiseUp(deltaT));
		}
		else if (deltaT < 38 * 1000) {
			this._deepCopy(result, this.finishRiseUp(deltaT));
		}
		else if (deltaT < 45 * 1000) {
			this._deepCopy(result, this.startPeakView(deltaT));
		}
		else if (deltaT < 55 * 1000) {
			this._deepCopy(result, this.peakRotation(deltaT));
		}
		else if (deltaT < 69050) {
			this._deepCopy(result, this.toTheEdge(deltaT));
		}
		else if (deltaT < 81050) {
			this._deepCopy(result, this.cutFromTheEdge(deltaT));
		}
		else if (deltaT < 93050) {
			this._deepCopy(result, this.volumetricCutFromTheEdge(deltaT));
		}
		else if (deltaT < 105050) {
			this._deepCopy(result, this.volumetricCutY(deltaT));
		}
		else if (deltaT < 117050) {
			this._deepCopy(result, this.rotatingCutY(deltaT));
		}
		else {
			this._deepCopy(result, this.lightSourceMovement(deltaT));
		}
		return result;
	}

	getMusicURL() {
		return 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3';
	}

	getMaxTime() {
		return 142050;
	}
	
	getKeyTimes() {
		return [
			69050,
			81040,
			 93050,
			105050,
			117050,
			129050,
			141050,
			153050
		];
	}
}