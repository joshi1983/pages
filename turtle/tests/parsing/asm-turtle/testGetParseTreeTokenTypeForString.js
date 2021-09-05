import { getParseTreeTokenTypeForString } from
'../../../modules/parsing/asm-turtle/getParseTreeTokenTypeForString.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/asm-turtle/ParseTreeTokenType.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testGetParseTreeTokenTypeForString(logger) {
	const cases = [
	{'in': '// hello', 'out': ParseTreeTokenType.COMMENT},
	{'in': 'var', 'out': ParseTreeTokenType.VAR_DECLARATIONS},
	{'in': 'VAR', 'out': ParseTreeTokenType.VAR_DECLARATIONS},
	{'in': '234', 'out': ParseTreeTokenType.NUMBER_LITERAL},
	{'in': '234.2342', 'out': ParseTreeTokenType.NUMBER_LITERAL},
	{'in': '-234', 'out': ParseTreeTokenType.NUMBER_LITERAL},
	{'in': '-234.345456', 'out': ParseTreeTokenType.NUMBER_LITERAL},
	{'in': ':', 'out': ParseTreeTokenType.COLON},
	{'in': '@x', 'out': ParseTreeTokenType.LABEL},
	{'in': '@@x', 'out': ParseTreeTokenType.LABEL},
	{'in': 'instr', 'out': ParseTreeTokenType.INSTRUCTION_LIST},
	{'in': 'INSTR', 'out': ParseTreeTokenType.INSTRUCTION_LIST},
	{'in': 'x', 'out': ParseTreeTokenType.VARIABLE_REFERENCE},
	];
	testInOutPairs(cases, getParseTreeTokenTypeForString, logger);
};