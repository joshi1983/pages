import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';

export function translateAppleSoftBasicToQBasic(code) {
	const scanTokens = scan(code);
	const result = scanTokensToCode(scanTokens);
	return result;
};