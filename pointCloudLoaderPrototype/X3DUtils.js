/*
This is code to be shared between X3DFileFormat.js from a 
point cloud loader and X3DFileFormatImporter.js from MeshViewer.
*/
class X3DUtils {
	
}

X3DUtils.getAttributeNumberDefaulted = function(element, attrName, defaultValue) {
	if (element.hasAttribute(attrName)) {
		var v = parseFloat(element.getAttribute(attrName).trim());
		if (typeof v !== 'number' || isNaN(v))
			return defaultValue;
		else
			return v;
	}
	else
		return defaultValue;
};

X3DUtils.getAttributeNumberArrayDefaulted = function(element, attrName, len, defaultValue) {
	if (element.hasAttribute(attrName)) {
		var v = X3DUtils.getNumbers(element.getAttribute(attrName));
		if (v.length !== len)
			return defaultValue;
		else {
			return v;
		}
	}
	else
		return defaultValue;
};

X3DUtils.getNumbers = function(s) {
	if (typeof s === 'string')
		s = s.split(/\s+/);
	
	return s.map(function(part) {
			if (typeof part === 'number' && !isNaN(part))
				return part;
			return parseFloat(part);
		}).filter(function(num) {
			return !isNaN(num);
		});
};

X3DUtils.getUnitVector = function(v) {
	var m = Math.sqrt(v[0] * v[0], v[1] * v[1], v[2] * v[2]);
	if (m === 0) {
		m = 1;
		v = [1, 0, 0];
	}
	m = 1 / m; // multiplying is often a little faster than dividing so get reciprocal.
	var result = [];
	for (var i = 0; i < 3; i++) {
		result.push(v[i] * m);
	}
	return result;
};

X3DUtils.storeDef = function(element, defs) {
	if (element.hasAttribute('DEF')) {
		var def = element.getAttribute('DEF');
		defs[def] = element;
	}
};

X3DUtils.getSceneFromText = function(content) {
	var xmlDoc;
	if (window.DOMParser)
	{
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(content, "text/xml");
	}
	else // Internet Explorer
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(content);
	}
	var scene = xmlDoc.getElementsByTagName('Scene');
	if (!scene) {
		var msg = 'No Scene element found in document.  Invalid X3D XML content';
		console.error(msg);
		throw new Error(msg);
	}
	return scene[0];
};

X3DUtils.getColourAndDefsFromShape = function(element, colour, defs) {
	let appearance = element.querySelector(':scope > Appearance');
	if (appearance) {
		let material = appearance.querySelector(':scope > Material[diffuseColor]');
		if (!material) {
			if (appearance.hasAttribute('USE')) {
				var key = appearance.getAttribute('USE');
				if (defs[key] !== undefined) {
					material = defs[key].querySelector(':scope > Material[diffuseColor]');
				}
			}
		}
		if (material) {
			let diffuseColour = X3DUtils.getNumbers(material.getAttribute('diffuseColor')).map(function(num) {
				return Math.max(0, Math.min(1, num));
			});
			if (diffuseColour.length === 3) {
				colour = {
					'r': diffuseColour[0],
					'g': diffuseColour[1],
					'b': diffuseColour[2]
				};
			}
		}
		X3DUtils.storeDef(appearance, defs);
	}
	return colour;
};

X3DUtils.subtract = function(v1, v2) {
	return v1.map(function(num1, index) {
		return num1 - v2[index];
	});
};

X3DUtils.add = function(v1, v2) {
	return v1.map(function(num1, index) {
		return num1 + v2[index];
	});
};

X3DUtils.getTransformer = function(transformElement) {
	var center = X3DUtils.getAttributeNumberArrayDefaulted(transformElement, 'center', 3, [0, 0, 0]);
	var scale = X3DUtils.getAttributeNumberArrayDefaulted(transformElement, 'scale', 3, [1, 1, 1]);
	var rotationInfo;
	var translation = X3DUtils.getAttributeNumberArrayDefaulted(transformElement, 'translation', 3, [0, 0, 0]);
	if (transformElement.hasAttribute('rotation')) {
		var rotation = X3DUtils.getAttributeNumberArrayDefaulted(transformElement, 'rotation', 4, [0, 0, 0, 0]);
		rotationInfo = ArbitraryAxisRotation.getRotateArbitraryAxisMatrices(rotation[0], rotation[1], rotation[2], rotation[3]);
	}
	var scaleOrientationInfo;
	var scaleOrientation;
	if (transformElement.hasAttribute('scaleOrientation')) {
		scaleOrientation = X3DUtils.getAttributeNumberArrayDefaulted(transformElement, 'scaleOrientation', 4, [0, 0, 1, 1]);
		scaleOrientationInfo = ArbitraryAxisRotation.getRotateArbitraryAxisMatrices(scaleOrientation[0], scaleOrientation[1], scaleOrientation[2], scaleOrientation[3]);
	}

	return function(point) {
		point = point.slice(0);
		point = X3DUtils.subtract(point, center);
		
		// scale orientation.
		if (scaleOrientationInfo !== undefined) {
			point = math.multiply(point, scaleOrientationInfo.toX);
			point = math.multiply(point, scaleOrientationInfo.xAxisRotation);
		}

		// scale.
		for (var i = 0; i < 3; i++) {
			point[i] = scale[i] * point[i];
		}
		if (point.length !== 3) {
			console.error('point.length should be 3 but is: ' + point.length);
		}
		else {
			for (var i = 0; i < 3; i++) {
				if (isNaN(point[i]) || typeof point[i] !== 'number') {
					console.error('non-number found at index ' + i);
				}
			}
		}

		if (scaleOrientationInfo !== undefined) {
			point = math.multiply(point, scaleOrientationInfo.fromXAxisRotation);
			point = math.multiply(point, scaleOrientationInfo.fromX);
		}

		
		// rotate.
		if (rotationInfo !== undefined)
			point = ArbitraryAxisRotation.rotateArbitraryUsingInfo(rotationInfo, point);

		point = X3DUtils.add(point, center);
		
		// translate.
		for (var i = 0; i < 3; i++) {
			point[i] = translation[i] + point[i];
		}
		return point;
	};
};