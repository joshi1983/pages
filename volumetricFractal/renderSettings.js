class RenderSettings {
	constructor(ambientLight, camera, circles, cRealValue, displayMode, 
	lightDirection, maxIterations, peakOpacity, planeCutAxis, planeCutValue, scale, smoothenColours, sphereRadius) {
		this.ambientLight = ambientLight;
		this.camera = camera;
		this.circles = circles;
		this.cRealValue = cRealValue;
		this.displayMode = displayMode;
		this.lightDirection = lightDirection;
		this.maxIterations = maxIterations;
		this.peakOpacity = peakOpacity;
		this.planeCutAxis = planeCutAxis;
		this.planeCutValue = planeCutValue;
		this.scale = scale;
		this.smoothenColours = smoothenColours;
		this.sphereRadius = sphereRadius;
		this.uiSettingsKeyToProp = {
			'ambientLight': {'propKey': 'ambientLight', 'sanitization': getDefaultedNumber},
			'cReal': {'propKey': 'cRealValue', 'sanitization': getDefaultedNumber},
			'displayMode': {'propKey': 'displayMode', 'sanitization': getDefaultedInteger},
			'maxIterations': {'propKey': 'maxIterations', 'sanitization': getDefaultedInteger},
			'peakOpacity': {'propKey': 'peakOpacity', 'sanitization': getDefaultedNumber},
			'planeCutAxis': {'propKey': 'planeCutAxis', 'sanitization': getDefaultedInteger},
			'planeCutValue': {'propKey': 'planeCutValue', 'sanitization': getDefaultedNumber},
			'smoothenColours': {'propKey': 'smoothenColours', 'sanitization': getDefaultedInteger},
			'sphereRadius': {'propKey': 'sphereRadius', 'sanitization': getDefaultedNumber},
		};
	}

	setAll(uiSettings) {
		for (var key in uiSettings) {
			if (this.uiSettingsKeyToProp[key] !== undefined) {
				var prop = this.uiSettingsKeyToProp[key];
				if (this[prop.propKey] === undefined) {
					throw new Error('Undefined property: ' + prop.propKey);
				}
				this[prop.propKey].set(prop.sanitization(uiSettings[key], this[prop.propKey].get()));
			}
		}
		this.camera.rotationAngle = getDefaultedNumber(uiSettings.rotationAngle, this.camera.rotationAngle);
		this.camera.rotationRadius = getDefaultedNumber(uiSettings.rotationRadius, this.camera.rotationRadius);
		this.camera.setPositionY(getDefaultedNumber(uiSettings.positionY, this.camera.positionY));
		this.scale.setScaleFactor(getDefaultedNumber(uiSettings.scaleFactor, this.scale.scaleFactor));
		this.circles.setLineThicknessFactor(getDefaultedNumber(uiSettings.lineThicknessFactor, 0.001));
		this.circles.setShowSphereOutline(getDefaultedNumber(uiSettings.isShowingCircumference, 1));
		this.lightDirection.setX(getDefaultedNumber(uiSettings.lightDirectionX, this.lightDirection.getX()));
		this.lightDirection.setY(getDefaultedNumber(uiSettings.lightDirectionY, this.lightDirection.getY()));
		this.lightDirection.setZ(getDefaultedNumber(uiSettings.lightDirectionZ, this.lightDirection.getZ()));
		this.camera.changed();
	}
}