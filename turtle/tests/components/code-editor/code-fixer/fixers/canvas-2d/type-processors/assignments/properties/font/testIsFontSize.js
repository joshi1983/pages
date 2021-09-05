import { isFontSize } from
'../../../../../../../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/type-processors/assignments/properties/font/isFontSize.js';
import { processFontCases } from './processFontCases.js';

export function testIsFontSize(logger) {
	const cases = [
	{'in': '700', 'out': false},
	{'in': '4s', 'out': false},
	{'in': '4px', 'out': true},
	{'in': 'italic', 'out': false},
	{'in': 'bold', 'out': false},
	{'in': 'Arial', 'out': false},
	];
	processFontCases(cases, isFontSize, logger);
};