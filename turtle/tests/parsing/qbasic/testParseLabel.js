import { processParseTestCases } from './processParseTestCases.js';

export function testParseLabel(logger) {
	const cases = [{
		'code': `ColorTab:`,
		'numTopChildren': 1
	},{
		'code': `Dim StdFrac%
ColorTab:`,
		'numTopChildren': 2
	},{
		'code': `Dim StdFrac%(scrX% - 1, scrY% - 1)
ColorTab:`,
		'numTopChildren': 2
	}];
	processParseTestCases(cases, logger);
};