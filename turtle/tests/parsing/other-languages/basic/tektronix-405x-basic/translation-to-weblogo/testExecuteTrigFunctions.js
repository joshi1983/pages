import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteTrigFunctions(logger) {
	const cases = [
		{'code': 'print sin(0)', 'messages': ['0']},
		{'code': '110 SET RADIANS\nprint sin(0)', 'messages': ['0']},
		{'code': 'print cos(0)', 'messages': ['1']},
		{'code': 'print tan(0)', 'messages': ['0']},
		{'code': 'print atn(0)', 'messages': ['0']},
		{'code': 'print asn(0)', 'messages': ['0']},
		{'code': '110 SET RADIANS\nprint cos(0)', 'messages': ['1']},
		{'code': '110 SET RADIANS\nprint sin(3.14159265358979)', 'messages': ['0']},
		{'code': '110 SET RADIANS\nprint sin(3.14159265358979 / 2)', 'messages': ['1']},
		{'code': '110 SET RADIANS\nprint sin(-3.14159265358979 / 2)', 'messages': ['-1']},
		{'code': '110 SET RADIANS\nprint tan(3.14159265358979)', 'messages': ['0']},
		{'code': '110 SET RADIANS\nprint tan(3.14159265358979 / 4)', 'messages': ['1']},

		{'code': '110 SET DEGREES\nprint sin(90)', 'messages': ['1']},
		{'code': '110 SET DEGREES\nprint sin(-90)', 'messages': ['-1']},
		{'code': '110 SET DEGREES\nprint atn(1)', 'messages': ['45']},
		{'code': 'SET DEGREES\nprint asn(1)', 'messages': ['90']},
		{'code': 'SET DEGREES\nprint acs(1)', 'messages': ['0']},
		{'code': 'SET DEGREES\nprint tan(45)', 'messages': ['1']},
		{'code': 'SET DEGREES\nprint tan(0)', 'messages': ['0']},
	];
	processTranslateExecuteCases(cases, logger);
};