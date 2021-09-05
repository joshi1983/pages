import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processForTokenToSimpleValueTest as _ } from '../processForTokenToSimpleValueTest.js';

export function processForTokenToSimpleValueTest(cases, f, logger) {
	_(cases, f, logger, {'type': ParseTreeTokenType.SWITCH});
};