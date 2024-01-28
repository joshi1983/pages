import { SetUtils } from '../../../../../../SetUtils.js';

export function getTokensOfSafeIdentifiersFromWebLogoVariablesInfo(webLogoVariablesInfo) {
	const result = new Set();
	for (const countInfo of webLogoVariablesInfo.values()) {
		SetUtils.addAll(result, countInfo.assignTokens);
		SetUtils.addAll(result, countInfo.readTokens);
	}
	return result;
};