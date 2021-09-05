import { breakLinesInProcedures } from './breakLinesInProcedures.js';
import { fixScanTokens } from './fixScanTokens.js';
import { LogoScanner } from
'../../../../../../parsing/LogoScanner.js';

export const options = {
	'isSplittingNumberPrefixes': false,
	'supressGroupingErrors': false
};

export function scan(code) {
	code = breakLinesInProcedures(code);
	code = `setScreenColor "black\nsetColors "white\n` + code;
	const tokens = LogoScanner.scan(code, options);
	fixScanTokens(tokens);
	return {'tokens': tokens, 'code': code};
};