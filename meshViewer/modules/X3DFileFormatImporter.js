import { MeshFileFormatImporter } from './MeshFileFormatImporter.js';
import { OBJFileFormatImporter } from './OBJFileFormatImporter.js';
import { Triangle } from './Triangle.js';
import { Vertex } from './Vertex.js';


/*
This only supports some of X3D's features.
The X3D format is pretty complicated.

Some test .x3d files came from: https://www.web3d.org/x3d/content/examples/Basic/StudentProjects/
Official X3D specifications are at: https://www.web3d.org/specifications/X3dSchemaDocumentation3.3/x3d-3.3.html

*/
export class X3DFileFormatImporter extends MeshFileFormatImporter {
	constructor() {
		super();
		this.accept = '.x3d';
	}

	_getAttributeBoolDefaulted(element, attrName, defaultValue) {
		if (element.hasAttribute(attrName)) {
			return element.getAttribute(attrName).trim().toLowerCase() === 'true';
		}
		else
			return defaultValue;
	}

	_colourObjectToArray(colour) {
		if (colour instanceof Array)
			return colour; // assume already converted.
		return [colour.r, colour.g, colour.b];
	}

	_createTriangleFromPositionsAndColour(positions, colour) {
		var vertices = positions.map(function(position) {
			return new Vertex(position, colour);
		});
		return new Triangle(vertices);
	}

	_getTrianglesFromQuad(positions, colour) {
		if (positions.length !== 4)
			throw new Error('positions.length must be 4 but instead is: ' + positions.length);
		
		return [
			this._createTriangleFromPositionsAndColour(positions.slice(0, 3), colour),
			this._createTriangleFromPositionsAndColour([positions[0], positions[2], positions[3]], colour)
		];
	}

	_getTrianglesFromCylinderWithObject(properties, colour) {
		var subdivisions = properties.subdivisions || 16;
		var radius = properties.radius || 1;
		var height = properties.height || 1;
		colour = this._colourObjectToArray(colour);
		var result = [];
		var prevX, prevZ;
		var y1 = height * 0.5, y2 = - height * 0.5;
		for (var i = -0.5; i <= subdivisions; i++) {
			var a = i * Math.PI * 2 / subdivisions;
			var x = radius * Math.cos(a);
			var z = radius * Math.sin(a);
			if (prevX !== undefined) {
				result.push(...this._getTrianglesFromQuad([
					[x, y1, z], [x, y2, z], [prevX, y2, prevZ], [prevX, y1, prevZ]], colour));
			}
			prevX = x;
			prevZ = z;
		}
		
		if (properties.top)
			result.push(...this._getTrianglesFromCircle2DRadius({
				'radius': radius,
				'subdivisions': subdivisions,
				'y': height * 0.5
			}, colour));
		if (properties.bottom)
			result.push(...this._getTrianglesFromCircle2DRadius({
				'radius': radius,
				'subdivisions': subdivisions,
				'y': -height * 0.5
			}, colour));
			
		return result;
	}

	_getTrianglesFromBox(boxElement, colour) {
		var size = X3DUtils.getAttributeNumberArrayDefaulted(boxElement, 'size', 3, [2, 2, 2]);
		var properties = {
			'radius': 1,
			'height': 1,
			'top': true,
			'bottom': true,
			'subdivisions': 4
		};
		var triangles = this._getTrianglesFromCylinderWithObject(properties, colour);
		// scale verticies of the triangles.
		triangles.forEach(function(triangle) {
			triangle.vertices.forEach(function(vertex) {
				vertex.position = [
					vertex.position[0] * size[0],
					vertex.position[1] * size[1],
					vertex.position[2] * size[2]
				];
			});
		});
		return triangles;
	}

	_getTrianglesFromCylinder(cylinderElement, colour) {
		var radius = X3DUtils.getAttributeNumberDefaulted(cylinderElement, 'radius', 1);
		var height = X3DUtils.getAttributeNumberDefaulted(cylinderElement, 'height', 1);
		var top = this._getAttributeBoolDefaulted(cylinderElement, 'top', true);
		var bottom = this._getAttributeBoolDefaulted(cylinderElement, 'bottom', true);
		return this._getTrianglesFromCylinderWithObject({
			'radius': radius,
			'height': height,
			'top': top,
			'bottom': bottom
		}, colour);
	}

	_getTrianglesFromDisk2D(diskElement, colour) {
		var innerRadius = X3DUtils.getAttributeNumberDefaulted(diskElement, 'innerRadius', 0);
		var outerRadius = X3DUtils.getAttributeNumberDefaulted(diskElement, 'outerRadius', 1);
		const numSides = 16;
		if (innerRadius <= 0) {
			// use half as many triangles if possible.
			return this._getTrianglesFromCircle2DRadius({
				'radius': outerRadius,
				'subdivisions': numSides
			}, colour, defs);
		}
		colour = this._colourObjectToArray(colour);
		var result = [];
		var prevX, prevZ, prevX2, prevZ2;
		for (var i = -0.5; i <= numSides; i++) {
			var a = i * Math.PI * 2 / numSides;
			var x = outerRadius * Math.cos(a);
			var z = outerRadius * Math.sin(a);
			var x2 = innerRadius * Math.cos(a);
			var z2 = innerRadius * Math.sin(a);
			if (prevX !== undefined) {
				result.push(...this._getTrianglesFromQuad([
					[x2, 0, z2], [x, 0, z], [prevX, 0, prevZ], [prevX2, 0, prevZ2]], colour));
			}
			prevX = x;
			prevZ = z;
			prevX2 = x2;
			prevZ2 = z2;
		}
		return result;
	}

	_getTrianglesFromCircle2DRadius(properties, colour, defs) {
		var radius = properties.radius || 1;
		var subdivisions = properties.subdivisions || 16;
		var y = properties.y || 0;
		var result = [];
		colour = this._colourObjectToArray(colour);
		for (var i = 0.5; i <= subdivisions; i++) {
			var a = i * Math.PI * 2 / subdivisions;
			var a2 = (i - 1) * Math.PI * 2 / subdivisions;
			var x = radius * Math.cos(a);
			var z = radius * Math.sin(a);
			var x2 = radius * Math.cos(a2);
			var z2 = radius * Math.sin(a2);
			var positions = [[x, y, z], [x2, y, z2], [0, y, 0]];
			result.push(this._createTriangleFromPositionsAndColour(positions, colour));
		}
		return result;
	}

	_getTrianglesFromCircle2D(circleElement, colour, defs) {
		var radius = X3DUtils.getAttributeNumberDefaulted(circleElement, 'radius', 1);
		return this._getTrianglesFromCircle2DRadius({'radius': radius}, colour, defs);
	}

	_getTrianglesFromCone(coneElement, colour, defs) {
		var bottomRadius = X3DUtils.getAttributeNumberDefaulted(coneElement, 'bottomRadius', 1);
		var height = X3DUtils.getAttributeNumberDefaulted(coneElement, 'height', 1);
		var topRadius = X3DUtils.getAttributeNumberDefaulted(coneElement, 'topRadius', 0);
		var subdivisions = X3DUtils.getAttributeNumberDefaulted(coneElement, 'subdivisions', 24);
		var bottom = this._getAttributeBoolDefaulted(coneElement, 'bottom', true);
		var top = topRadius !== 0 && this._getAttributeBoolDefaulted(coneElement, 'top', bottom);
		var result = [];
		var prevX, prevZ, prevX2, prevZ2;
		var y1 = -height * 0.5, y2 = height * 0.5;
		colour = this._colourObjectToArray(colour);
		for (var i = -0.5; i <= subdivisions; i++) {
			var a = i * Math.PI * 2 / subdivisions;
			var x = bottomRadius * Math.cos(a);
			var z = bottomRadius * Math.sin(a);
			var x2 = topRadius * Math.cos(a);
			var z2 = topRadius * Math.sin(a);
			if (prevX !== undefined) {
				if (topRadius !== 0) {
					result.push(...this._getTrianglesFromQuad([
						[x2, y2, z2], [x, y1, z], [prevX, y1, prevZ], [prevX2, y2, prevZ2]], colour));
				}
				else {
					// use fewer triangles if possible.
					result.push(this._createTriangleFromPositionsAndColour([
						[0, y2, 0], [x, y1, z], [prevX, y1, prevZ]], colour));
				}
			}
			prevX = x;
			prevZ = z;
			prevX2 = x2;
			prevZ2 = z2;
		}
		if (top) {
			result.push(...this._getTrianglesFromCircle2DRadius({
				'radius': topRadius,
				'y': height * 0.5,
				'subdivisions': subdivisions
			}, colour, defs));
		}
		if (bottom) {
			result.push(...this._getTrianglesFromCircle2DRadius({
				'radius': bottomRadius,
				'y': -height * 0.5,
				'subdivisions': subdivisions
			}, colour, defs));
		}
		return result;
	}

	_getTrianglesFromSphere(sphereElement, colour, defs) {
		var radius = X3DUtils.getAttributeNumberDefaulted(sphereElement, 'radius', 1);
		var subdivisions = X3DUtils.getAttributeNumberArrayDefaulted(sphereElement, 'subdivisions', 2, [24, 24]);
		var result = [];
		var positions = [];
		colour = this._colourObjectToArray(colour);
		function indx(i, j) {
			return (j * subdivisions[0] + i + positions.length * 10) % positions.length;
		}
		
		for (var j = 0; j < subdivisions[1]; j++) {
			var a2 = (j - subdivisions[1] * 0.5) * Math.PI / subdivisions[1];
			for (var i = -0.5; i < subdivisions[0]; i++) {
				var a = i * Math.PI * 2 / subdivisions[0];
				var r = radius * Math.cos(a2);
				var y = radius * Math.sin(a2);
				var z = r * Math.cos(a);
				var x = r * Math.sin(a);
				positions.push([x, y, z]);
			}
		}
		for (var j = 1; j < subdivisions[1]; j++) {
			var j2 = (j - 1) % subdivisions[1];
			for (var i = 0; i < subdivisions[0]; i++) {
				var i2 = (i - 1) % subdivisions[0];
				if (i === 0) {
					i2 = subdivisions[0] - 1;
				}
				result.push(... this._getTrianglesFromQuad([
					positions[indx(i2, j2)],
					positions[indx(i2, j)],
					positions[indx(i, j)],
					positions[indx(i, j2)]
				], colour));
			}
		}
		// FIXME: need a top for the sphere.
		
		return result;
	}

	_addTrianglesForFace(triangles, curPoints, colour) {
		if (curPoints.length >= 3) {
			var faceVertices = curPoints.map(function(position) {
				return new Vertex(position, colour);
			});
			triangles.push(...OBJFileFormatImporter.getTrianglesFromVertexCoordinates(faceVertices));
		}
		return [];
	}

	_getTrianglesFromIndexedFaceSet(element, colour, defs, coordinateElement) {
		colour = this._colourObjectToArray(colour);
		colour = X3DUtils.getAttributeNumberArrayDefaulted(element, 'color', 3, colour);
		var coordIndexes = [];
		if (element.hasAttribute('coordIndex'))
			coordIndexes = X3DUtils.getNumbers(element.getAttribute('coordIndex'));
		var coordinates = [];
		if (coordinateElement === undefined) {
			coordinateElement = element.querySelector(':scope > Coordinate');
			if (coordinateElement && coordinateElement.hasAttribute('USE'))
				coordinateElement = defs[coordinateElement.getAttribute('USE')];
		}
		var result = [];
		if (coordinateElement) {
			X3DUtils.storeDef(coordinateElement, defs);
			if (coordinateElement.hasAttribute('point')) {
				var coordinates = X3DUtils.getNumbers(coordinateElement.getAttribute('point'));
				var points = [];
				for (var i = 0; i < coordinates.length; i+= 3) {
					points.push(coordinates.slice(i, i + 3));
				}
				var curPoints = [];
				for (var i = 0; i < coordIndexes.length; i++) {
					var index = coordIndexes[i];
					if (index < 0) {
						curPoints = this._addTrianglesForFace(result, curPoints, colour);
					}
					else {
						curPoints.push(points[index]);
					}
				}
				curPoints = this._addTrianglesForFace(result, curPoints, colour);
			}
		}
		return result;
	}

	_getTrianglesFromSeparator(element, colour, defs) {
		var coordinateElement = element.querySelector(':scope > Coordinate, :scope > Coordinate3');
		if (!coordinateElement)
			coordinateElement = undefined;
		var materialElement = element.querySelector(':scope > Material');
		if (materialElement !== null) {
			colour = X3DUtils.getAttributeNumberArrayDefaulted(materialElement, 'diffuseColor', 3, colour);
		}
		var indexedFaceSetElement = element.querySelector(':scope > IndexedFaceSet');
		if (indexedFaceSetElement !== null)
			return this._getTrianglesFromIndexedFaceSet(indexedFaceSetElement, colour, defs, coordinateElement);
		return [];
	}

	_getTrianglesFromShape(element, colour, defs) {
		colour = X3DUtils.getColourAndDefsFromShape(element, colour, defs);
		var result = this._getTrianglesFromChildren(element, colour, defs);
		return result;
	}

	_getTrianglesFromGroup(groupElement, colour, defs) {
		return this._getTrianglesFromChildren(groupElement, colour, defs);
	}

	_getTrianglesFromTransform(transformElement, colour, defs) {
		var triangles = this._getTrianglesFromChildren(transformElement, colour, defs);
		var transformer = X3DUtils.getTransformer(transformElement);

		triangles.forEach(function(triangle) {
			triangle.vertices.forEach(function(vertex) {
				vertex.position = transformer(vertex.position);
			});
		});
		return triangles;
	}

	_getTrianglesFromChildren(element, colour, defs) {
		var result = [];
		// loop through child elements.
		for (var child = element.firstChild; child !== null; child = child.nextSibling) {
			result.push(... this._getTrianglesFrom(child, colour, defs));
		}

		return result;
	}

	_getTrianglesFrom(element, colour, defs) {
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
					results.push(...this._getTrianglesFrom(defs[key], colour, defs));
				}
			}
			if (typeof this['_getTrianglesFrom' + tagName] === 'function') {
				this['_getTrianglesFrom' + tagName](element, colour, defs).forEach(function(t) {
					results.push(t);
				});
			}
			else {
				this._getTrianglesFromChildren(element, colour, defs).forEach(function(t) {
					results.push(t);
				});
			}
			return results;
		}
	}

	getTrianglesFromScene(scene, defaultRGB) {
		var defs = {};
		var result = this._getTrianglesFrom(scene, defaultRGB, defs);
		console.log('returning ' + result.length + ' triangles.');
		return result;
	}

	_loadAsciiXML(content, defaultRGB) {
		var scene = X3DUtils.getSceneFromText(content);
		return this.getTrianglesFromScene(scene, defaultRGB);
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
				resolver(outer._loadAsciiXML(content, defaultRGB));
			};
		});
	}
}