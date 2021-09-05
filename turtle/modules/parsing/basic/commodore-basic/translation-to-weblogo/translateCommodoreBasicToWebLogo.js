import { fixQBasicParseTree } from './fixers/fixQBasicParseTree.js';
import { translateCommodoreBasicToQBasic } from
'./translateCommodoreBasicToQBasic.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateCommodoreBasicToWebLogo(commodoreBasicCode) {
	const qbasicCode = translateCommodoreBasicToQBasic(commodoreBasicCode);
	return translateQBASICToWebLogo(qbasicCode, undefined, undefined, fixQBasicParseTree);
};