import { processTestCases } from './processTestCases.js';
import { validateUnusedIdentifiers } from
'../../../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/validating-modules/validateUnusedIdentifiers.js';

export function testValidateUnusedIdentifiers(logger) {
	const cases = [
	{'code': '', 'error': false},
	{'code': 'const x = 0;', 'error': true},
	{'code': 'let x = 0;', 'error': true},
	{'code': 'var x = 0;', 'error': true},
	{'code': 'var x;', 'error': true},
	{'code': 'let x;', 'error': true},
	{'code': 'var x, y=4;', 'error': true},
	{'code': 'let x, y=5;', 'error': true},
	{'code': 'function x() {}', 'error': true},
	{'code': 'function x(y) {}', 'error': true},
	{'code': 'async function x(y) {}', 'error': true},
	{'code': 'class A {}', 'error': true},
	{'code': 'class A {constructor(x, y) {}}', 'error': true},
	{'code': 'class A {static m(x, y) {}}', 'error': true},
	{'code': `import { B } from './B.js';
class A extends B {
	constructor() {
		super();
	}
}`, 'error': true}, // A is not used.
	{'code': "import { x } from './x.js';", 'error': true},
	{'code': "import { x } from './x.js';\n x();", 'error': false},
	{'code': 'const x = {}; x.y = 4;', 'error': false},
	{'code': 'const timer = setInterval(function() {}, 100); clearInterval(timer)', 'error': false},
	{'code': 'new Promise(function(resolve, reject) {});', 'error': false},
	{'code': 'import("./A");', 'error': false},

	{'code': 'const x = 4; X=5;', 'error': true},
	{'code': 'const sym1 = Symbol();', 'error': true},
	{'code': `let x = '';
for (var name in this)
    x += name + "\n";`, 'error': false},
	{'code': 'export function f() {};', 'error': false},
	{'code': 'export async function f() {};', 'error': false},
	{'code': 'export class A {};', 'error': false},
	{'code': 'const x=2; export {x};', 'error': false},
	{'code': 'class A {} export {A};', 'error': false},
	{'code': 'import A from "./A.js"; export {A};', 'error': false},
	{'code': 'const A = 3;export { A };', 'error': false},
	{'code': `import { x as y } from './x.js';`, 'error': true},
	{'code': `import { x as y } from './x.js'; y();`, 'error': false},
	{'code': 'let x = 4; console.log(``);', 'error': true},
	{'code': 'let x = 4; console.log(`x`);', 'error': true},
	{'code': 'let x = 4; console.log(x);', 'error': false},
	{'code': 'let x = 4; console.log(`${x}`);', 'error': false},
	{'code': 'let x = 4; console.log(`${ x }`);', 'error': false},
	];
	processTestCases(cases, validateUnusedIdentifiers, logger);
};