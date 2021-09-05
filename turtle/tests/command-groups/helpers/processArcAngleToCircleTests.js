import { createTestTurtle } from '../../helpers/createTestTurtle.js';
import { equalWithinThreshold } from '../../../modules/equalWithinThreshold.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { StringBuffer } from '../../../modules/StringBuffer.js';

function stringifyCaseInfo(obj) {
	const result = new StringBuffer();
	for (let key in obj) {
		result.append(`${key}=${obj[key]}, `);
	}
	return result.toString();
}

export function processArcAngleToCircleTests(cases, arcFunc, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, caseInfo=${stringifyCaseInfo(caseInfo)}`, logger);
		const turtle = createTestTurtle();
		turtle.setHeading(caseInfo.heading);
		turtle.jumpTo(caseInfo.position);
		const result = arcFunc(turtle, caseInfo.arcRadius, caseInfo.circlePosition, caseInfo.circleRadius);
		let threshold = 0.0000001;
		if (caseInfo.errorThreshold !== undefined)
			threshold = caseInfo.errorThreshold;
		if (!equalWithinThreshold(result, caseInfo.out, threshold))
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};