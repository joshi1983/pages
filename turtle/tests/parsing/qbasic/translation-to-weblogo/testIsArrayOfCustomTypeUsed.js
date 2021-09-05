import { isArrayOfCustomTypeUsed } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/isArrayOfCustomTypeUsed.js';
import { parse } from
'../../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testIsArrayOfCustomTypeUsed(logger) {
	const cases = [
		{'code': '', 'out': false},
		{'code': 'dim var1 as T', 'out': false},
		{'code': 'dim var1(4) as integer', 'out': false},
		{'code': 'dim var1(4) as String', 'out': false},
		{'code': 'dim var1(3) as T', 'out': false},
		// false because T is not defined in the same code.

		{'code': 'type T\nx as integer\nEND TYPE', 'out': false},
		{'code': 'type T\nx as integer\nEND TYPE\ndim var1 as T', 'out': false},
		{'code': 'type T\nx as integer\nEND TYPE\ndim var1(4) as T', 'out': true},
		{'code': 'type T\nx as integer\nEND TYPE\ndim var1(3, 4) as T', 'out': true},
		{'code': `TYPE Ant
	x as integer
end TYPE
NumAnts = 30
DIM Ants(1 TO NumAnts) AS Ant`, 'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const result = isArrayOfCustomTypeUsed(parseResult.root);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${result}`);
	});
};