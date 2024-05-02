import { isNumber } from
'../../../../../modules/isNumber.js';
import { Orientation3D } from
'../../../../../modules/drawing/vector/Orientation3D.js';
import { orientedArc } from
'../../../../../modules/drawing-menu/download/line-segments/shape-conversion/orientedArc.js';
import { OrientedArcShape } from
'../../../../../modules/drawing/vector/shapes/OrientedArcShape.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testOrientedArc(logger) {
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
		const orientation = new Orientation3D();
		orientation.setPitchRadians(Math.PI / 3);
		orientation.setHeadingRadians(rotationRadians);
		const arcShape = new OrientedArcShape(pos, orientation, radius, angle);
		const lines = orientedArc(arcShape, 90);
		if (!(lines instanceof Array))
			plogger(`Expected an Array but got ${lines}`);
		else {
			const firstPoint = lines[0].point1;
			const lastPoint = lines[lines.length - 1].point2;
			const startPoint = arcShape.getStartPoint();
			const endPoint = arcShape.getEndPoint();
			if (!firstPoint.equalsCloseEnough(startPoint))
				plogger(`Expected first point to be ${startPoint} but found ${firstPoint}`);
			if (!lastPoint.equalsCloseEnough(endPoint))
				plogger(`Expected last point to be ${endPoint} but found ${lastPoint}`);
		}
	});
};