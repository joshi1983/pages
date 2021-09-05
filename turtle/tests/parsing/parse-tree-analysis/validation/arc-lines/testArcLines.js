import { testIsArcLinesDrawingAnything } from './testIsArcLinesDrawingAnything.js';
import { testValidateArcLinesInfo } from './testValidateArcLinesInfo.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testArcLines(logger) {
	wrapAndCall([
		testIsArcLinesDrawingAnything,
		testValidateArcLinesInfo
	], logger);
};