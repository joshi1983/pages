import { flatten } from
'../../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../../../modules/parsing/js-parsing/parse.js';
import { shouldDeclarationBeRemoved } from
'../../../../../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/type-processors/assignments/shouldDeclarationBeRemoved.js';
import { testInOutPairs } from
'../../../../../../../helpers/testInOutPairs.js';

function countShouldDeclarationBeRemoved(code) {
	const parseResult = parse(code);
	return flatten(parseResult.root).filter(shouldDeclarationBeRemoved).length;
}

export function testShouldDeclarationBeRemoved(logger) {
	const cases = [
	{'in': '', 'out': 0},
	{'in': 'x = 4', 'out': 0},
	{'in': 'y = "hi";', 'out': 0},
	{'in': 'const y = document.getElementsByTagName("p");', 'out': 1},
	{'in': 'const y = document.getElementById("hi");', 'out': 1},
	{'in': 'let y = document.getElementById("hi");', 'out': 1},
	{'in': 'var y = document.getElementById("hi");', 'out': 1},
	{'in': 'y = document.getElementById("hi");', 'out': 0}, // not a declaration
	{'in': 'const y = document.getElementById("hi"), x = document.getElementById("yo");', 'out': 1},
	{'in': 'const y = canvas.getContext("2d");', 'out': 1},
	{'in': 'let y = canvas.getContext("2d");', 'out': 1},
	{'in': 'var y = canvas.getContext("2d");', 'out': 1},
	];
	testInOutPairs(cases, countShouldDeclarationBeRemoved, logger);
};