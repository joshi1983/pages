import { identifierToWebLogoIdentifier } from
'../../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/type-processors/helpers/identifierToWebLogoIdentifier.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

export function testIdentifierToWebLogoIdentifier(logger) {
	const cases = [
	{'in': 'i', 'out': 'i'},
	{'in': 'x', 'out': 'x'},
	{'in': 's$', 'out': 's'},
	{'in': 'n%', 'out': 'n'},
	{'in': 'f&&', 'out': 'f'},
	{'in': 'false', 'out': 'false1'},
	{'in': 'true', 'out': 'true1'},
	{'in': 'end', 'out': 'end1'},
	{'in': 'to', 'out': 'to1'}
	];
	testInOutPairs(cases, identifierToWebLogoIdentifier, logger);
};