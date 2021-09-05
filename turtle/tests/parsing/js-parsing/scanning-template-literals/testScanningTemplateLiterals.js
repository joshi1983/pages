import { testScanTemplateLiteralExpressions } from './testScanTemplateLiteralExpressions.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testScanningTemplateLiterals(logger) {
	wrapAndCall([
		testScanTemplateLiteralExpressions
	], logger);
};