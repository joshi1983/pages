import { identifierToWebLogoIdentifier } from
'../../../../../../modules/parsing/qbasic/translation-to-weblogo/type-processors/helpers/identifierToWebLogoIdentifier.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testIdentifierToWebLogoIdentifier(logger) {
	const cases = [
	{'in': 'i', 'out': 'i'},
	{'in': 'x', 'out': 'x'},
	{'in': 's$', 'out': 's'},
	{'in': 'n%', 'out': 'n'},
	{'in': 'f&&', 'out': 'f'}
	];
	testInOutPairs(cases, identifierToWebLogoIdentifier, logger);
};