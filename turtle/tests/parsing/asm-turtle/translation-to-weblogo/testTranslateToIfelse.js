import { translate } from '../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testTranslateToIfelse(logger) {
	const cases = [
	{
		'in': 'je @elseLabel\nfd 1\njmp @endIfElse\n@@elseLabel:\nrt 90\n@@endIfElse',
		'out': 'make "comparisonRegister 0\nifelse :comparisonRegister <> 0 [\n\tforward 1\n] [\n\tright 90\n]'
	},
	{
		'in': 'jne @elseLabel\nfd 1\njmp @endIfElse\n@@elseLabel:\nrt 90\n@@endIfElse',
		'out': 'make "comparisonRegister 0\nifelse :comparisonRegister = 0 [\n\tforward 1\n] [\n\tright 90\n]'
	},
	{
		'in': 'fd 123\njne @elseLabel\nfd 1\njmp @endIfElse\n@@elseLabel:\nrt 90\n@@endIfElse\nfd 321',
		'out': 'make "comparisonRegister 0\nforward 123\nifelse :comparisonRegister = 0 [\n\tforward 1\n] [\n\tright 90\n]\nforward 321'
	},
	];
	testInOutPairs(cases, translate, logger);
};