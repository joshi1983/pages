import { CircleShape } from '../../../../modules/drawing/vector/shapes/CircleShape.js';
import { createRadialGradient } from '../../../helpers/createRadialGradient.js';
import { LineJoinStyle } from '../../../../modules/drawing/vector/shapes/style/LineJoinStyle.js';
import { LineSegmentShape } from '../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { lineToCircle } from '../../../../modules/drawing/drawers/svg/lineToCircle.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testLineToCircle(logger) {
	const roundStyle = new ShapeStyle();
	roundStyle.setLineJoinStyle(LineJoinStyle.Round);
	const gradientStyle = new ShapeStyle();
	const p1 = new Vector3D(0, 0, 0);
	const radialGradient = createRadialGradient();
	gradientStyle.setPenGradient(radialGradient);
	const cases = [
		{
			'line': new LineSegmentShape(p1, p1, roundStyle),
			'hasFillGradient': false
		},
		{
			'line': new LineSegmentShape(p1, p1, gradientStyle),
			'hasFillGradient': true
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = lineToCircle(caseInfo.line);
		if (!(result instanceof CircleShape))
			plogger(`Expected a circle but got ${result}`);
		else {
			const hasFillGradient = (result.style.getFillGradient() !== undefined);
			if (hasFillGradient !== caseInfo.hasFillGradient)
				plogger(`Expected to have fill gradient of ${caseInfo.hasFillGradient} but found ${hasFillGradient}`);
		}
	});
};