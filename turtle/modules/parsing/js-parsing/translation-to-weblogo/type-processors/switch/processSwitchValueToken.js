import { mightHaveSideEffects } from
'../../../mightHaveSideEffects.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function processSwitchValueToken(processToken, switchValueToken, result) {
	if (switchValueToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	switchValueToken.children.length > 1) {
		switchValueToken = switchValueToken.children[1];
		if (mightHaveSideEffects(switchValueToken)) {
			processToken(switchValueToken, result);
		}
	}
};