import { ArcShape } from '../../../../modules/drawing/vector/shapes/ArcShape.js';
import { createDrawingFromCode } from '../../../helpers/createDrawingFromCode.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

const halfPi = Math.PI / 2;
function rectangleCaseInfoToElements(caseInfo, style, logger) {
	if (typeof caseInfo.elementsInfo === 'object' &&
	caseInfo.elementsInfo.code !== undefined) {
		const elementsInfo = caseInfo.elementsInfo;
		const drawing = createDrawingFromCode(elementsInfo.code, logger);
		const shapes = drawing.getShapesArray();
		const paths = shapes.filter(s => s instanceof PathShape);
		if (paths.length === 0)
			throw new Error(`Expected to find a PathShape but did not in array of ${shapes.length} shapes.`);
		if (!Number.isInteger(elementsInfo.pathIndex))
			throw new Error(`Expected pathIndex to be an integer but got ${elementsInfo.pathIndex}`);
		if (elementsInfo.pathIndex < 0)
			return paths[paths.length + elementsInfo.pathIndex];
		if (elementsInfo.pathIndex >= paths.length)
			throw new Error(`Unable to get PathShape [${elementsInfo.pathIndex}] because paths.length = ${paths.length}`);
		return paths[elementsInfo.pathIndex];
	}
	return caseInfo.elementsInfo.map(function(elementInfo) {
		if (typeof elementInfo === 'string') {
		}
		else if (elementInfo instanceof Array)
			return new Vector3D(elementInfo);
		else {
			const position = new Vector3D(elementInfo.pos);
			const radius = elementInfo.radius;
			const angle = halfPi;
			const rotationRadians = elementInfo.rotationRadians;
			return new ArcShape(position, rotationRadians, radius, angle, style);
		}
	});
}

export function processRectangleCaseInfo(logger) {
	return function(caseInfo) {
		const style = new ShapeStyle(caseInfo.style);
		const elements = rectangleCaseInfoToElements(caseInfo, style, logger);
		if (elements instanceof PathShape)
			caseInfo.path = elements;
		else {
			if (!(elements instanceof Array))
				throw new Error(`elements expected to be an Array but got ${elements}.`);
			caseInfo.path = new PathShape(elements, caseInfo.isClosed, style);
		}
		delete caseInfo.coords;
		delete caseInfo.style;
	};
};