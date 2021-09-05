import { getCodeForReferencedProcedures } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/getCodeForReferencedProcedures.js';
import { LogoScanner } from
'../../../../../../modules/parsing/LogoScanner.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetCodeForReferencedProcedures(logger) {
	const cases = [
		{'in': 'cheerfulSetTurtle', 'outContains': ['to cheerfulSetTurtle']}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.in}`, logger);
		const tokens = LogoScanner.scan(caseInfo.in);
		const result = getCodeForReferencedProcedures(tokens);
		for (const s of caseInfo.outContains) {
			if (result.indexOf(s) === -1) {
				plogger(`Expected to find ${s} but could not find that in "${result}"`);
			}
		}
	});
};