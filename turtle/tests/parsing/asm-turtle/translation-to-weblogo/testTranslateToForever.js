import { translate } from '../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testTranslateToForever(logger) {
	const cases = [
	{'in': '@@start:\nfd 1\njmp @start', 'out': 'forever [\n\tforward 1\n]'},
	{'in': '@@start:\nfd 1\nrt 1\njmp @start', 'out': 'forever [\n\tforward 1\n\tright 1\n]'},
	{'in': 'lt 45\n@@start:\nfd 1\nrt 1\njmp @start', 'out': 'left 45\nforever [\n\tforward 1\n\tright 1\n]'},
	];
	testInOutPairs(cases, translate, logger);
};