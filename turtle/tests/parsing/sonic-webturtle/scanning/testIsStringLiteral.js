import { isStringLiteral } from '../../../../modules/parsing/sonic-webturtle/scanning/isStringLiteral.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Token } from '../../../../modules/parsing/generic-parsing-utilities/Token.js';

export function testIsStringLiteral(logger) {
	const cases = [
	{'tokenVals': ['let', 'x'], 'tokenVal': '3', 'out': false},
	{'tokenVals': ['let', '$x'], 'tokenVal': '3', 'out': true},
	{'tokenVals': ['push'], 'tokenVal': 'x', 'out': false},
	{'tokenVals': ['pop'], 'tokenVal': 'x', 'out': false},
	{'tokenVals': ['draw', '3'], 'tokenVal': 'e', 'out': false},
	{'tokenVals': ['print'], 'tokenVal': 'e', 'out': true},
	{'tokenVals': ['print'], 'tokenVal': '3', 'out': true},
	{'tokenVals': ['turtleprint'], 'tokenVal': '3', 'out': true},
	{'tokenVals': ['turtlePRint'], 'tokenVal': '3', 'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tokens = caseInfo.tokenVals.map(val => new Token(val, 0, 0));
		const tokenIndex = tokens.length;
		const result = isStringLiteral(tokens, tokenIndex, caseInfo.tokenVal);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};