import { mightHaveSideEffects } from
'../../../../../../../parsing/js-parsing/mightHaveSideEffects.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

export function processSwitchValueToken(switchValueToken, result) {
	if (switchValueToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	switchValueToken.children.length > 1) {
		switchValueToken = switchValueToken.children[1];
		if (mightHaveSideEffects(switchValueToken)) {
			processToken(switchValueToken, result);
		}
	}
};