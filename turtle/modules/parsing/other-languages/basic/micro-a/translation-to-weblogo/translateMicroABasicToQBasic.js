import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';

export function translateMicroABasicToQBasic(code) {
	const tokens = scan(code);
	return scanTokensToCode(tokens);
};