import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

export function testTranslateExecuteOperators(logger) {
	const cases = [
		{'code': '1+2', 'messages': ['3']},
		{'code': '2*3', 'messages': ['6']},
		{'code': '2<3', 'messages': ['true']},
		{'code': '2<2', 'messages': ['false']},
		{'code': '2==3', 'messages': ['false']},
		{'code': '2==2', 'messages': ['true']},
		{'code': '3>2', 'messages': ['true']},
		{'code': '3>3', 'messages': ['false']},
		{'code': '4>=3', 'messages': ['true']},
		{'code': '3>=3', 'messages': ['true']},
		{'code': '2>=3', 'messages': ['false']},
		{'code': '2<=3', 'messages': ['true']},
		{'code': '3<=3', 'messages': ['true']},
		{'code': '4<=3', 'messages': ['false']},
		{'code': '1 + 2*3', 'messages': ['7']},
		{'code': '1*2 + 3', 'messages': ['5']},
		{'code': '1.0/2 + 3', 'messages': ['3.5']},
		//{'code': '1/2 + 3', 'messages': ['3']}
	];
	cases.forEach(function(caseInfo) {
		caseInfo.code = `import "fmt"\nfmt.Println(${caseInfo.code})`;
	});
	processTranslateExecuteCases(cases, logger);
};