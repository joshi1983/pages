import { isWebLogoVariableAlwaysLocalAtEnd } from './isWebLogoVariableAlwaysLocalAtEnd.js';
import { MaybeDecided } from '../../../../../../MaybeDecided.js';
import { WebLogoVariableInfo } from './WebLogoVariableInfo.js';

/*
varInfo should be a value from the result of getVariableCountsFromParseTree.
*/
export function isVariableCountsVariableInfoAlwaysLocalAtEnd(varInfo) {
	if (varInfo.isAlwaysLocal === MaybeDecided.Yes)
		return MaybeDecided.Yes;
	if (varInfo.isAlwaysGlobal === MaybeDecided.Yes)
		return MaybeDecided.No;
	const webLogoVarInfo = new WebLogoVariableInfo('unknown');
	webLogoVarInfo.readTokens = varInfo.readTokens;
	webLogoVarInfo.makeTokens = varInfo.writeTokens;
	webLogoVarInfo.varReferences = varInfo.varReferences;
	return isWebLogoVariableAlwaysLocalAtEnd(webLogoVarInfo);
};