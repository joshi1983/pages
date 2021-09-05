import { LogoScanner } from
'../../../../../modules/parsing/LogoScanner.js';
import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/other-languages/turtleSpaces/scanning/scan.js';
await LogoScanner.asyncInit();

export function testScan(logger) {
	const cases = [{
		'code': '',
		'len': 0
	},{
		'code': "|Hello World|",
		'tokens': ["'Hello World'"]
	},{
		'code': "print |Hello World|",
		'tokens': ['print', "'Hello World'"]
	},{
		'code': "print |Hello  World|",
		'tokens': ['print', "'Hello  World'"]
	},{
		'code': 'snappy:penUp',
		'tokens': ['penUp']
	}];
	processScanTestCases(cases, scan, logger);
};