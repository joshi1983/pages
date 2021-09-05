import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';

export function translateSinclairBasicToQBasic(code) {
	const scanTokens = scan(code);
	const result = scanTokensToCode(scanTokens);
	return result;
};