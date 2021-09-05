import { isFontStyle } from
'../../../../../../../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/type-processors/assignments/properties/font/isFontStyle.js';
import { processFontCases } from './processFontCases.js';

export function testIsFontStyle(logger) {
	const cases = [
	{'in': 'bold', 'out': false},
	{'in': '4', 'out': false},
	{'in': '4px', 'out': false},
	{'in': 'Arial', 'out': false},
	{'in': 'italic', 'out': true},
	{'in': 'oblique', 'out': true},
	];
	processFontCases(cases, isFontStyle, logger);
};