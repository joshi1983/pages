import { isUnsafeToReplaceReferencesWithJSVariable } from './isUnsafeToReplaceReferencesWithJSVariable.js';
import { WebLogoVariableInfo } from './WebLogoVariableInfo.js';

export function isUnsafeToReplaceReferencesWithJSVariableFromCounts(varCountsInfo) {
	const varInfo = new WebLogoVariableInfo('unknown');
	varInfo.makeTokens = varCountsInfo.writeTokens;
	varInfo.readTokens = varCountsInfo.readTokens;
	return isUnsafeToReplaceReferencesWithJSVariable(varInfo);
};