import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testExecMath(logger) {
	const cases = [
		{'code': '1', 'messages': ['1']},
		{'code': '2', 'messages': ['2']},
		{'code': '1.5', 'messages': ['1.5']},
		{'code': '23', 'messages': ['23']},
		{'code': '-23', 'messages': ['-23']},
		{'code': '013', 'messages': ['11']}, // octal
		{'code': '-013', 'messages': ['-11']}, // octal
		{'code': '0x11', 'messages': ['17']}, // hexadecimal
		{'code': '-0x11', 'messages': ['-17']}, // hexadecimal
		{'code': '1+2', 'messages': ['3']},
		{'code': '2*3', 'messages': ['6']},
		{'code': '10/2', 'messages': ['5']},
		{'code': '1+10/2', 'messages': ['6']},
		{'code': 'true^true', 'messages': ['false']},
		{'code': 'true^false', 'messages': ['true']},
		{'code': '!true', 'messages': ['false']},
		{'code': '!false', 'messages': ['true']},
		{'code': 'true&&false', 'messages': ['false']},
		{'code': 'false&&true', 'messages': ['false']},
		{'code': 'true&&true', 'messages': ['true']},
		{'code': 'false&&false', 'messages': ['false']},
		{'code': 'true||false', 'messages': ['true']},
		{'code': 'false||true', 'messages': ['true']},
		{'code': 'true||true', 'messages': ['true']},
		{'code': 'false||false', 'messages': ['false']},
		{'code': 'math.Pi', 'messages': ['3.141593']},
		{'code': 'math.abs(0)', 'messages': ['0']},
		{'code': 'math.abs(2)', 'messages': ['2']},
		{'code': 'math.abs(-2)', 'messages': ['2']},
		{'code': 'math.sin(0)', 'messages': ['0']},
		{'code': 'math.sin(math.Pi)', 'messages': ['0']},
		{'code': 'math.cos(0)', 'messages': ['1']},
		{'code': 'math.cos(math.Pi)', 'messages': ['-1']},
		{'code': 'math.tan(0)', 'messages': ['0']},
		{'code': 'math.tan(math.Pi)', 'messages': ['0']},
		{'code': 'math.signum(0)', 'messages': ['0']},
		{'code': 'math.signum(1)', 'messages': ['1']},
		{'code': 'math.signum(-1)', 'messages': ['-1']},
		{'code': 'math.signum(10)', 'messages': ['1']},
		{'code': 'math.hypot(0, 1)', 'messages': ['1']},
		{'code': 'math.hypot(1, 0)', 'messages': ['1']},
		{'code': 'math.hypot(0, 0)', 'messages': ['0']},
		{'code': 'math.hypot(3, 4)', 'messages': ['5']},
		{'code': 'math.exp(0)', 'messages': ['1']},
		{'code': 'math.log(1)', 'messages': ['0']},
		{'code': 'math.log(math.E)', 'messages': ['1']},
		{'code': 'math.log10(1)', 'messages': ['0']},
		{'code': 'math.log10(10)', 'messages': ['1']},
		{'code': 'math.log10(100)', 'messages': ['2']},
		{'code': '(1.1).toInt', 'messages': ['1']},
		{'code': '(21.1).toInt', 'messages': ['21']},
	];
	cases.forEach(function(caseInfo) {
		caseInfo.code = `println(${caseInfo.code})`;
	});
	processTranslateExecuteCases(cases, logger);
};