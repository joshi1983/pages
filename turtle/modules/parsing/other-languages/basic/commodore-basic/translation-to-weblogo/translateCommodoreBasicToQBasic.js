import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
import { scanToQBasicTokens } from '../scanning/scanToQBasicTokens.js';

export function translateCommodoreBasicToQBasic(code) {
	const scanTokens = scanToQBasicTokens(code);
	const result = scanTokensToCode(scanTokens);
	return result;
};