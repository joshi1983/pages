import { assertEquals } from
'../../../helpers/assertEquals.js';
import { findToken } from
'../../../helpers/findToken.js';
import { flatten } from
'../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { isComplete } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/isCompleteWithNext.js';
import { MaybeDecided } from
'../../../../modules/MaybeDecided.js';
import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testIsComplete(logger) {
	const cases = [
		{'code': 'x++', 'token': {
					'val': '++'
				},
				'out': MaybeDecided.Yes
		},
		{'code': '++', 
			'token': {
				'val': '++'
			},
			'out': MaybeDecided.No
		}
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tokens = flatten(parseResult.root);
		const token = findToken(caseInfo.token, tokens, plogger);
		if (token !== undefined) {
			const result = isComplete(token);
			assertEquals(MaybeDecided.stringify(caseInfo.out), MaybeDecided.stringify(result), plogger);
		}
	});
};