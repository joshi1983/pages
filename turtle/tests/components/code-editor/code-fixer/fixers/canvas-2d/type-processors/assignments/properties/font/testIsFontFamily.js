import { isFontFamily } from
'../../../../../../../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/type-processors/assignments/properties/font/isFontFamily.js';
import { processFontCases } from './processFontCases.js';

export function testIsFontFamily(logger) {
	const cases = [
	{'in': '4', 'out': false},
	{'in': '4s', 'out': false},
	{'in': '4px', 'out': false},
	{'in': 'italic', 'out': false},
	{'in': 'bold', 'out': false},
	{'in': 'Arial', 'out': true},
	{'in': "'Arial'", 'out': true},
	];
	processFontCases(cases, isFontFamily, logger);
};