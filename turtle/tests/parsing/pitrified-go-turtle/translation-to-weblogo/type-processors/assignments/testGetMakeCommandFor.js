import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getMakeCommandFor } from
'../../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/type-processors/assignments/getMakeCommandFor.js';
import { parse } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetMakeCommandFor(logger) {
	const cases = [
		{'code': 'f()',
			'token': {'val': 'f'},
			'out': 'make'
		},
		{'code': 'func main() { f() }',
			'token': {'val': 'f'},
			'out': 'make'
		},
		{'code': 'func main() { f() }',
			'token': {'val': 'f'},
			'out': 'make'
		},
		{'code': 'func main(x int) { print(x) }',
			'token': {'val': 'x', 'childrenLength': 0},
			'out': 'localmake'
		},
		{'code': `func main() {
		var x int 
		print(x)
}`,
			'token': {'val': 'x', 'childrenLength': 0},
			'out': 'localmake'
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const token = findToken(caseInfo.token, tokens, plogger);
		if (token !== undefined) {
			const commandName = getMakeCommandFor(token, 'x');
			assertEquals(caseInfo.out, commandName, plogger);
		}
	});
};