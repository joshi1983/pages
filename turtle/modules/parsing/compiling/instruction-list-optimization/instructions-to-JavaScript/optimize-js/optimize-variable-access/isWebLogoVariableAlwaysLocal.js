import { isLocalVariablesGetCall } from '../token-classifiers/isLocalVariablesGetCall.js';
import { MaybeDecided } from '../../../../../../MaybeDecided.js';

/*
info should be an instance of WebLogoVariableInfo
*/
export function isWebLogoVariableAlwaysLocal(info) {
	let firstToken = info.getFirstAssignToken();
	if (firstToken !== undefined) {
		const t = firstToken.parentNode.children[1];
		if (isLocalVariablesGetCall(t))
			return MaybeDecided.Yes;
	}
	return MaybeDecided.Maybe;
};