import { processScanTestCases } from '../../../processScanTestCases.js';
import { scan } from '../../../../../modules/parsing/basic/texas-instruments-99-4a/scanning/scan.js';

export function testScan(logger) {
	const cases = [{
		'code': 'call PRINT "hi"',
		'tokens': [
			'PRINT', '"hi"'
		]
	},{
		'code': 'REM some comment',
		'tokens': [
			'REM some comment'
		]
	},{
		'code': '10 CALL CLEAR',
		'tokens': [
			'10', 'cls'
		]
	},{
		'code': '!@P+',
		'tokens': []
	},{
		'code': '!@P-',
		'tokens': []
	},{
		'code': '!@P+ !@P-',
		'tokens': []
	},{
		'code': 'sub s()\nsubexit\nsubend',
		'tokens': ['sub', 's', '(', ')', 'exit', 'sub', 'end', 'sub']
	}
	];
	processScanTestCases(cases, scan, logger);
};