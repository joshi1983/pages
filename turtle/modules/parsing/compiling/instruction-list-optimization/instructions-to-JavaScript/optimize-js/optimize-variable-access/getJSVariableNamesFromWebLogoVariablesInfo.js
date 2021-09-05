import { SetUtils } from '../../../../../../SetUtils.js';

export function getJSVariableNamesFromWebLogoVariablesInfo(webLogoVariablesInfo) {
	const result = new Set();
	for (const varInfo of webLogoVariablesInfo.values()) {
		SetUtils.addAll(result, varInfo.jsVarNames);
	}
	return result;
};