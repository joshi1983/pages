import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecute_PI(logger) {
	const cases = [
		// _PI is not defined in QBASIC 1.1 but is in qb64.
		// These cases are based on documentation at:
		// https://qb64phoenix.com/qb64wiki/index.php/PI
		{'code': 'print _PI', 'messages': ['3.141593']},
		{'code': 'radius = 5\nprint _PI(radius ^ 2)',
		'messages': ['78.53982']
		},

		// I'm not sure what QB64 would do with the following but
		// returning 3.1415.. seems better than failing 
		// to translate or throwing an error.
		{'code': 'print _PI()', 'messages': ['3.141593']},
	];
	processTranslateExecuteCases(cases, logger);
};