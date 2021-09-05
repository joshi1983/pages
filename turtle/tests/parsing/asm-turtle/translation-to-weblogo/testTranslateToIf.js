import { translate } from '../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testTranslateToIf(logger) {
	const cases = [
	{'in': 'jmp @endLabel\nfd 1\n@@endLabel:', 'out': ''},
	{'in': 'je @endLabel\nfd 1\n@@endLabel:', 'out': 'make "comparisonRegister 0\nif :comparisonRegister <> 0 [\n\tforward 1\n]'},
	{'in': 'jne @endLabel\nfd 1\n@@endLabel:', 'out': 'make "comparisonRegister 0\nif :comparisonRegister = 0 [\n\tforward 1\n]'},
	{'in': 'jne @endLabel\nfd 1\n@@endLabel2:\n@@endLabel:', 'out': 'make "comparisonRegister 0\nif :comparisonRegister = 0 [\n\tforward 1\n]'},
	{'in': 'jl @endLabel\nfd 1\n@@endLabel:', 'out': 'make "comparisonRegister 0\nif :comparisonRegister >= 0 [\n\tforward 1\n]'},
	{'in': 'jnl @endLabel\nfd 1\n@@endLabel:', 'out': 'make "comparisonRegister 0\nif :comparisonRegister < 0 [\n\tforward 1\n]'},
	];
	testInOutPairs(cases, translate, logger);
};