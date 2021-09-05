import { genericProcessTo } from
'../../../../../modules/parsing/other-languages/basic/helpers/genericProcessTo.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { processScanTestCases } from
'../../../processScanTestCases.js';
import { scan } from
'../../../../../modules/parsing/other-languages/basic/qbasic/scanning/scan.js';

const migrationData = {
	'functions': [
		{
			'name': 'clear screen',
			'to': 'cls'
		},
		{
			'name': 'sin',
			'to': 'sin'
		}
	]
};

export function testGenericProcessTo(logger) {
	const cases = [
		{'code': 'clear screen',
			'tokens': ['cls']
		},
		{'code': `clear screen
print "hi"`,
			'tokens': ['cls', 'print', '"hi"']
		},
		{'code': 'print sin(1)',
			'tokens': ['print', 'sin', '(', '1', ')']
		}
	];
	const processTo = genericProcessTo(migrationData);
	const wrappedScan = function(code) {
		const tokens = scan(code);
		processTo(tokens);
		return tokens;
	};
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		processScanTestCases(cases, wrappedScan, plogger);
	});
};