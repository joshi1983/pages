import { arc } from
'../../../../../modules/drawing-menu/download/line-segments/shape-conversion/arc.js';
import { ArcShape } from
'../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { isNumber } from
'../../../../../modules/isNumber.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testArc(logger) {
	const radius = 100;
	const pos = new Vector3D(1, 2, 3);
	const cases = [
	{'rotationRadians': 0, 'angle': Math.PI},
	{'rotationRadians': 0, 'angle': -Math.PI},
	{'rotationRadians': Math.PI / 4, 'angle': Math.PI},
	{'rotationRadians': Math.PI / 2, 'angle': Math.PI},
	{'rotationRadians': Math.PI, 'angle': Math.PI},
	{'rotationRadians': Math.PI, 'angle': -Math.PI},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const rotationRadians = caseInfo.rotationRadians;
		if (!isNumber(rotationRadians))
			plogger(`Expected rotationRadians to be a number but got ${rotationRadians}`);
		const angle = caseInfo.angle;
		if (!isNumber(angle))
			plogger(`Expected angle to be a number but got ${angle}`);
		const arcShape = new ArcShape(pos, rotationRadians, radius, angle);
		const lines = arc(arcShape, 90);
		if (!(lines instanceof Array))
			plogger(`Expected an Array but got ${lines}`);
		else {
			const firstPoint = lines[0].point1;
			const lastPoint = lines[lines.length - 1].point2;
			const startPoint = arcShape.getStartPoint();
			const endPoint = arcShape.getEndPoint();
			if (!firstPoint.equalsCloseEnough(startPoint))
				plogger(`Expected ${startPoint} but found ${firstPoint}`);
			if (!lastPoint.equalsCloseEnough(endPoint))
				plogger(`Expected ${endPoint} but found ${lastPoint}`);
		}
	});
};