import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { CylinderShape } from '../../../../modules/drawing/vector/shapes/CylinderShape.js';
import { EllipseShape } from '../../../../modules/drawing/vector/shapes/EllipseShape.js';
import { EllipseArcShape } from '../../../../modules/drawing/vector/shapes/EllipseArcShape.js';
import { getImageDataUrl } from '../../../helpers/getImageDataUrl.js';
import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { RasterRectangleShape } from '../../../../modules/drawing/vector/shapes/RasterRectangleShape.js';
import { shapeToDetailsDTO } from '../../../../modules/drawing-menu/shape-explorer/serialization/shapeToDetailsDTO.js';
import { SphereShape } from '../../../../modules/drawing/vector/shapes/SphereShape.js';
import { TextShape } from '../../../../modules/drawing/vector/shapes/TextShape.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testShapeToDetailsDTO(logger) {
	const dataUrl = getImageDataUrl();
	const pathPoints = [new Vector3D(0, 0, 0), new Vector3D(100, 50, 0), new Vector3D(0, 100, 0)];
	const cases = [
		{'shape': new ArcShape(new Vector3D(0, 0, 0), 0, 100, Math.PI), 'keys': ['radius']},
		{'shape': new CircleShape(new Vector3D(0, 0, 0), 100), 'keys': ['radius']},
		{'shape': new CylinderShape(new Vector3D(0, 0, 0), new Vector3D(100, 0, 50), 50), 'keys': ['radius']},
		{'shape': new EllipseArcShape(new Vector3D(0, 0, 0), 0, 50, 100, Math.PI * 0.5, Math.PI), 
			'keys': ['angle', 'radius1', 'radius2', 'startAngle']},
		{'shape': new EllipseShape(new Vector3D(0, 0, 0), 0, 50, 100), 'keys': ['radius1', 'radius2']},
		{'shape': new LineSegmentShape(new Vector3D(0, 0, 0), new Vector3D(100, 0, 0)), 'keys': ['endPoint']},
		{'shape': new PathShape(pathPoints, false), 'keys': ['isClosed', 'elements']},
		{'shape': new RasterRectangleShape(new Vector3D(0, 0, 0), 100, 100, 0, dataUrl, 1), 'keys': ['height', 'width']},
		{'shape': new RasterRectangleShape(new Vector3D(0, 0, 0), 100, 100, 0, dataUrl, 0), 'keys': ['height', 'width']},
		{'shape': new SphereShape(new Vector3D(0, 0, 0), 100), 'keys': ['radius']},
		{'shape': new TextShape(new Vector3D(0, 0, 0), 0, 'Hello World'), 'keys': ['text', 'rotation']},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = shapeToDetailsDTO(caseInfo.shape);
		if (typeof result !== 'object')
			plogger('Expected an object but got ' + result);
		else {
			caseInfo.keys.forEach(function(key) {
				if (result[key] === undefined)
					plogger(`Expected a value set for "${key}" but got undefined`);
			});
			if (result.position !== undefined)
				plogger('position should not be in the result because it shows elsewhere in the Shapes Explorer');
			try {
				JSON.stringify(result);
			}
			catch (e) {
				plogger(`Unexpected error while running JSON.stringify on result.  error = ${e}`);
			}
		}
	});
};