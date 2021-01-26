/*
This only supports some of X3D's features.
The X3D format is pretty complicated.

Some test .x3d files came from: https://www.web3d.org/x3d/content/examples/Basic/StudentProjects/
Official X3D specifications are at: https://www.web3d.org/specifications/X3dSchemaDocumentation3.3/x3d-3.3.html

*/
class X3DFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.x3d';
	}

	_getPointsFromBox(boxElement, colour) {
		var size = X3DUtils.getAttributeNumberArrayDefaulted(boxElement, 'size', 3, [2, 2, 2]);
		var result = [];
		for (var dx = -0.5; dx <= 0.5; dx ++) {
			for (var dy = -0.5; dy <= 0.5; dy ++) {
				for (var dz = -0.5; dz <= 0.5; dz ++) {
					result.push(new Point([dx * size[0], dy * size[1], dz * size[2]], colour.r, colour.g, colour.b));
				}
			}
		}
		return result;
	}

	_getPointsFromSphere(sphereElement, colour) {
		var radius = X3DUtils.getAttributeNumberDefaulted(sphereElement, 'radius', 1);
		var subdivisions = X3DUtils.getAttributeNumberArrayDefaulted(sphereElement, 'subdivisions', 2, [24, 24]);
		var result = [];
		for (var i = 0; i < subdivisions[0]; i++) {
			var a = i * Math.PI * 2 / subdivisions[0];
			var y = radius * Math.sin(a);
			var r = radius * Math.cos(a);
			for (var j = 0; j < subdivisions[1]; j++) {
				var a2 = j * Math.PI / subdivisions[1];
				var z = r * Math.cos(a2);
				var x = r * Math.sin(a2);
				result.push(new Point([x, y, z], colour.r, colour.g, colour.b));
			}
		}

		return result;
	}

	_getPointsFromCone(coneElement, colour) {
		var bottomRadius = X3DUtils.getAttributeNumberDefaulted(coneElement, 'bottomRadius', 1);
		var height = X3DUtils.getAttributeNumberDefaulted(coneElement, 'height', 1);
		var topRadius = X3DUtils.getAttributeNumberDefaulted(coneElement, 'topRadius', 0);
		var subdivisions = X3DUtils.getAttributeNumberDefaulted(coneElement, 'subdivisions', 24);
		var result = [];
		if (topRadius === 0) {
			result.push(new Point([0, height/2, 0], colour.r, colour.g, colour.b));
		}
		for (var i = 0; i < subdivisions; i++) {
			var a = i * Math.PI * 2 / subdivisions;
			var x = bottomRadius * Math.sin(a);
			var z = bottomRadius * Math.cos(a);
			result.push(new Point([x, -height/2, z], colour.r, colour.g, colour.b));
			if (topRadius !== 0) {
				x = topRadius * Math.sin(a);
				z = topRadius * Math.cos(a);
				result.push(new Point([x, height/2, z], colour.r, colour.g, colour.b));
			}
		}
		return result;
	}

	_cylinder(radius, height, r, g, b) {
		const numSides = 16;
		var result = [];
		height *= 0.5;
		for (var i = 0; i < numSides; i++) {
			var a = i * Math.PI * 2 / numSides;
			var x = radius * Math.cos(a);
			var z = radius * Math.sin(a);
			result.push(new Point([x, -height, z], r, g, b));
			result.push(new Point([x, height, z], r, g, b));
		}
		return result;
	}

	_getPointsFromCylinder(cylinderElement, colour) {
		var radius = X3DUtils.getAttributeNumberDefaulted(cylinderElement, 'radius', 1);
		var height = X3DUtils.getAttributeNumberDefaulted(cylinderElement, 'height', 1);
		return this._cylinder(radius, height, colour.r, colour.g, colour.b);
	}

	_getPointsFromDisk2D(diskElement, colour) {
		var innerRadius = X3DUtils.getAttributeNumberDefaulted(diskElement, 'innerRadius', 0);
		var outerRadius = X3DUtils.getAttributeNumberDefaulted(diskElement, 'outerRadius', 1);
		const numSides = 16;
		var r = colour.r, g = colour.g, b = colour.b;
		var result = [];
		for (var i = 0; i < numSides; i++) {
			var a = i * Math.PI * 2 / numSides;
			var x = outerRadius * Math.cos(a);
			var z = outerRadius * Math.sin(a);
			result.push(new Point([x, 0, z], r, g, b));
			if (innerRadius > 0) {
				x = innerRadius * Math.cos(a);
				z = innerRadius * Math.sin(a);
				result.push(new Point([x, 0, z], r, g, b));
			}
		}
		return result;
	}

	_getPointsFromCircle2D(circleElement, colour) {
		var radius = X3DUtils.getAttributeNumberDefaulted(circleElement, 'radius', 1);
		const numSides = 16;
		var r = colour.r, g = colour.g, b = colour.b;
		var result = [];
		for (var i = 0; i < numSides; i++) {
			var a = i * Math.PI * 2 / numSides;
			var x = radius * Math.cos(a);
			var z = radius * Math.sin(a);
			result.push(new Point([x, 0, z], r, g, b));
		}
		return result;
	}

	_getPointsFromCoordinate(coordinateElement, colour) {
		if (coordinateElement.hasAttribute('point')) {
			var pointStr = coordinateElement.getAttribute('point');
			var coords = X3DUtils.getNumbers(pointStr);
			var points = [];
			for (var j = 0; j < coords.length; j += 3) {
				var pointCoords = coords.slice(j, j + 3);
				points.push(new Point(pointCoords, colour.r, colour.g, colour.b));
			}
			return points;
		}
		else
			return [];
	}

	_getPointsFromCoordinate3(coordinateElement, colour) {
		return this._getPointsFromCoordinate(coordinateElement, colour);
	}

	_getPointsFromExtrusion(extrusionElement, colour) {
		// FIXME: get points from extrusion.
		// Some documentation on it is at: 
		// https://www.web3d.org/x3d/tooltips/X3dTooltips.html#Extrusion
		return [];
	}

	_getPointsFromTransform(transformElement, colour, defs) {
		var points = this._getPointsFromChildren(transformElement, colour, defs);
		var transformer = X3DUtils.getTransformer(transformElement);
		points.forEach(function(point) {
			point.coords = transformer(point.coords);
		});
		return points;
	}

	_getPointsFromChildren(element, colour, defs) {
		var result = [];
		// loop through child elements.
		for (var child = element.firstChild; child !== null; child = child.nextSibling) {
			result.push(... this._getPointsFrom(child, colour, defs));
		}
		return result;
	}

	_getPointsFromShape(element, colour, defs) {
		colour = X3DUtils.getColourAndDefsFromShape(element, colour, defs);
		var result = this._getPointsFromChildren(element, colour, defs);
		return result;
	}

	_getPointsFromGroup(groupElement, colour, defs) {
		return this._getPointsFromChildren(groupElement, colour, defs);
	}

	_getPointsFrom(element, colour, defs) {
		if (typeof defs !== 'object')
			throw new Error('defs must be an object.  Not: ' + defs);
		var tagName = element.tagName;
		if (tagName === undefined || ['Viewpoint', 'Appearance', 'Background'].indexOf(tagName) !== -1)  {
			// if tagName is undefined, element is not an element so no points.
			// Appearance is processed within the _getPointsFromShape method.
			// This script can't handle Viewpoint.  It uses its own viewpoints.
			// Background also makes no sense for this script.  It won't hold any points.
			return [];
		}
		else {
			var results = [];
			if (element.hasAttribute('DEF'))
				X3DUtils.storeDef(element, defs);
			else if (element.hasAttribute('USE')) {
				// load points from the element.
				var key = element.getAttribute('USE');
				if (defs[key] !== undefined) {
					results.push(...this._getPointsFrom(defs[key], colour, defs));
				}
			}
			if (typeof this['_getPointsFrom' + tagName] === 'function') {
				results.push(...this['_getPointsFrom' + tagName](element, colour, defs));
			}
			else {
				this._getPointsFromChildren(element, colour, defs).forEach(function(p) {
					results.push(p);
				});
			}
			return results;
		}
	}
	
	getPointsFromScene(scene, defaultRGB) {
		var defs = {};
		return this._getPointsFrom(scene, defaultRGB, defs);
	}

	_loadFromXMLText(content, defaultRGB) {
		var scene = X3DUtils.getSceneFromText(content);
		console.log('scene is ', scene);
		return this.getPointsFromScene(scene, defaultRGB);
	}

	loadFromFile(file, defaultRGB) {
		if (typeof defaultRGB !== 'object')
			defaultRGB = {'r': 0, 'g': 0, 'b': 0};
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		var outer = this;
		return new Promise(function(resolver, rejecter) {
			reader.onload = function (evt) {
				var content = evt.target.result;
				resolver(outer._loadFromXMLText(content, defaultRGB));
			};
		});
	}
}