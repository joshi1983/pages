import { translateBBCBasicToQBasic } from
'./translateBBCBasicToQBasic.js';
import { translateBBCBasicQBasicToWebLogo } from
'./translateBBCBasicQBasicToWebLogo.js';

export function translateBBCBasicToWebLogo(bbcBasicCode) {
	const qbasicCode = translateBBCBasicToQBasic(bbcBasicCode);
	return translateBBCBasicQBasicToWebLogo(qbasicCode);
};