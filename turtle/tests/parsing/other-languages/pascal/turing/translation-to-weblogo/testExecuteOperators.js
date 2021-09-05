import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteOperators(logger) {
	const cases = [
		{'in': '1+2', 'out': '3'},
		{'in': '1-2', 'out': '-1'},
		{'in': '1/2', 'out': '0.5'},
		{'in': '1 div 2', 'out': '0'},
		{'in': '2*0.5', 'out': '1'},
		{'in': '1**2', 'out': '1'},
		{'in': '3 + 4 * 5', 'out': '23'},
		{'in': '4 * 5 + 3', 'out': '23'},
		{'in': '3 + 20 / 5', 'out': '7'},
		{'in': '20 / 5 + 3', 'out': '7'},
		{'in': '1 + 2**3', 'out': '9'},
		{'in': '2**3 + 1', 'out': '9'},
		{'in': '1+2**3', 'out': '9'},
		{'in': '2**3+1', 'out': '9'},
		{'in': '2 * 2**3', 'out': '16'},
		{'in': '3 * 2**3', 'out': '24'},
		{'in': '4 * 2**3', 'out': '32'},
		{'in': '2**3 * 2', 'out': '16'},
		{'in': '2*2**3', 'out': '16'},
		{'in': '2**3*2', 'out': '16'},
		{'in': '2**3*3', 'out': '24'},
		{'in': '2**3*4', 'out': '32'},
		{'in': '2*3/2', 'out': '3'},
		{'in': '1<2', 'out': 'true'},
		{'in': '1<1', 'out': 'false'},
		{'in': '1<-1', 'out': 'false'},
		{'in': '1<=2', 'out': 'true'},
		{'in': '1<=1', 'out': 'true'},
		{'in': '1<=-1', 'out': 'false'},
		{'in': '1=2', 'out': 'false'},
		{'in': '1=1', 'out': 'true'},
		{'in': '1=-1', 'out': 'false'},
		{'in': '1 not= 2', 'out': 'true'},
		{'in': '1 not= 1', 'out': 'false'},
		{'in': '1 not= -1', 'out': 'true'},
		{'in': '1 > 2', 'out': 'false'},
		{'in': '1 > 1', 'out': 'false'},
		{'in': '1 > -1', 'out': 'true'},
		{'in': '1 >= 2', 'out': 'false'},
		{'in': '1 >= 1', 'out': 'true'},
		{'in': '1 >= -1', 'out': 'true'},
		{'in': 'true and true', 'out': 'true'},
		{'in': 'true and false', 'out': 'false'},
		{'in': 'false and true', 'out': 'false'},
		{'in': 'false and false', 'out': 'false'},
		{'in': 'true or true', 'out': 'true'},
		{'in': 'true or false', 'out': 'true'},
		{'in': 'false or true', 'out': 'true'},
		{'in': 'false or false', 'out': 'false'},
		{'in': 'true => true', 'out': 'true'},
		{'in': 'true => false', 'out': 'false'},
		{'in': 'false => true', 'out': 'true'},
		{'in': 'false => false', 'out': 'true'},
		{'in': 'true xor true', 'out': 'false'},
		{'in': 'true xor false', 'out': 'true'},
		{'in': 'false xor true', 'out': 'true'},
		{'in': 'false xor false', 'out': 'false'},
	];
	for (const caseInfo of cases) {
		caseInfo.code = 'put ' + caseInfo.in;
		caseInfo.messages = [caseInfo.out];
		delete caseInfo.in;
		delete caseInfo.out;
	}
	processTranslateExecuteCases(cases, logger);
};