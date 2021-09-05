import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from
'../../helpers/scanTokensToCode.js';

export function translateHTBasicToQBasic(code) {
	const tokens = scan(code);
	return scanTokensToCode(tokens);
};