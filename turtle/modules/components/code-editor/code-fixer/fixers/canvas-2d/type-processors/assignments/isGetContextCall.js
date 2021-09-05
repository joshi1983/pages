import { getDeepestName } from
'../../../../../../../parsing/other-languages/js-parsing/translation-to-weblogo/type-processors/processFunctionCall.js';

export function isGetContextCall(token) {
	const deepestName = getDeepestName(token);
	if (deepestName !== 'getContext')
		return false;
	return true;
}