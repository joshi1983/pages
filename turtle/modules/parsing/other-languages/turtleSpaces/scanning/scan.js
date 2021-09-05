import { LogoScanner } from
'../../../LogoScanner.js';
import { processColon } from
'./processColon.js';
import { processPipes } from
'./processPipes.js';

const tokenProcessors = [
	processColon,
	processPipes
];

export function scan(code) {
	const tokens = LogoScanner.scan(code);
	for (const process of tokenProcessors) {
		process(tokens);
	}
	return tokens;
};