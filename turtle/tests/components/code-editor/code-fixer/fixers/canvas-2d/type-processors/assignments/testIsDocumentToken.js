import { flatten } from
'../../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { isDocumentToken } from
'../../../../../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/type-processors/assignments/isDocumentToken.js';
import { parse } from
'../../../../../../../../modules/parsing/js-parsing/parse.js';
import { testInOutPairs } from
'../../../../../../../helpers/testInOutPairs.js';

function countDocumentTokens(code) {
	const parseResult = parse(code);
	return flatten(parseResult.root).filter(isDocumentToken).length;
}

export function testIsDocumentToken(logger) {
	const cases = [
	{'in': '', 'out': 0},
	{'in': 'x = 4', 'out': 0},
	{'in': 'y = "hi";', 'out': 0},
	{'in': 'document.getElementById("canvasDemo"). getContext("2d")', 'out': 1},
	{'in': 'const y = document.getElementsByTagName("p");', 'out': 1},
	{'in': 'const y = document.getElementById("hi");', 'out': 1},
	{'in': 'let y = document.getElementById("hi");', 'out': 1},
	{'in': 'var y = document.getElementById("hi");', 'out': 1},
	{'in': 'y = document.getElementById("hi");', 'out': 1},
	{'in': 'const y = document.getElementById("hi"), x = document.getElementById("yo");', 'out': 2},
	];
	testInOutPairs(cases, countDocumentTokens, logger);
};