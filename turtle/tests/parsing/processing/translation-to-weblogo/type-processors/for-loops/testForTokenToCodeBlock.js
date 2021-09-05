import { forTokenToCodeBlock } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/forTokenToCodeBlock.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processTokenToTokenCases } from './processTokenToTokenCases.js';

export function testForTokenToCodeBlock(logger) {
	const cases = [
		{'code': 'for', 'outToken': null},
		{'code': 'for (', 'outToken': null},
		{'code': 'for (int x', 'outToken': null},
		{'code': 'for (int x=1', 'outToken': null},
		{'code': 'for (int x=1;', 'outToken': null},
		{'code': 'for (int x=1;;) {}',
			'outToken': {
				'type': ParseTreeTokenType.CODE_BLOCK
			}
		},
		{'code': 'for (int x=1;x<100;x++) {}',
			'outToken': {
				'type': ParseTreeTokenType.CODE_BLOCK
			}
		}
	];
	processTokenToTokenCases(cases, forTokenToCodeBlock, logger);
};