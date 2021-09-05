import { LogoScanner } from
'../../../../../../../modules/parsing/LogoScanner.js';
import { options } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/scanning/scan.js';
import { processScanTestCases } from
'../../../../../../parsing/processScanTestCases.js';

function scan(func) {
	return function(code) {
		if (typeof code !== 'string')
			throw new Error(`code must be a string but code=${code}`);

		const tokens = LogoScanner.scan(code, options);
		func(tokens);
		return tokens;
	};
}

export function processScanTokenProcessCases(cases, func, logger) {
	processScanTestCases(cases, scan(func), logger);
};