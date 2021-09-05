import { testProcessAssignmentPrefix } from
'./testProcessAssignmentPrefix.js';
import { testProcessReadExpression } from
'./testProcessReadExpression.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testOperators(logger) {
	wrapAndCall([
		testProcessAssignmentPrefix,
		testProcessReadExpression
	], logger);
};