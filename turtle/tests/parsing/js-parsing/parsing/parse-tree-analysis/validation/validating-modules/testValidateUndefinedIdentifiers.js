import { processTestCases } from './processTestCases.js';
import { validateUndefinedIdentifiers } from
'../../../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/validating-modules/validateUndefinedIdentifiers.js';

export function testValidateUndefinedIdentifiers(logger) {
	const cases = [
	{'code': '', 'error': false},
	{'code': 'const x = 0;', 'error': false},
	{'code': 'let x = 0;', 'error': false},
	{'code': 'var x = 0;', 'error': false},
	{'code': 'var x;', 'error': false},
	{'code': 'let x;', 'error': false},
	{'code': 'var x, y=4;', 'error': false},
	{'code': 'let x, y=5;', 'error': false},
	{'code': 'function x() {}', 'error': false},
	{'code': 'function x(y) {}', 'error': false},
	{'code': 'async function x(y) {}', 'error': false},
	{'code': 'class A {}', 'error': false},
	{'code': 'class A {constructor(x, y) {}}', 'error': false},
	{'code': 'class A {static m(x, y) {}}', 'error': false},
	{'code': 'class A {async m(x, y) {}}', 'error': false},
	{'code': 'class A {static async exist(x) {}}', 'error': false},
	{'code': `class A {
	constructor() {}
	method1() {
		
	}
	static method2() {
	}
}`, 'error': false},
	{'code': `import { B } from './B.js';
class A extends B {
	constructor() {
		super();
		console.log(arguments.length);
	}
}`, 'error': false},
	{'code': "import { x } from './x.js';", 'error': false},
	{'code': "import { x } from './x.js';\n x();", 'error': false},
	{'code': 'const x = {}; x.y = 4;', 'error': false},
	{'code': 'console.log("hi");', 'error': false},
	{'code': 'document.createElement("textarea");', 'error': false},
	{'code': 'alert("hi");', 'error': false},
	{'code': 'prompt("hi");', 'error': false},
	{'code': 'fetch("./test.txt");', 'error': false},
	{'code': 'Math.sin(4);', 'error': false},
	{'code': 'window.x = 4;', 'error': false},
	{'code': 'console.log(Number.isInteger(3));', 'error': false},
	{'code': 'new FileReader()', 'error': false},
	{'code': 'JSON.stringify({})', 'error': false},
	{'code': 'Object.assign({}, {})', 'error': false},
	{'code': 'Infinity + 3', 'error': false},
	{'code': 'setInterval(function() {}, 100)', 'error': false},
	{'code': 'const timer = setInterval(function() {}, 100); clearInterval(timer)', 'error': false},
	{'code': 'let timer = setTimeout(function() {}, 100); clearTimeout(timer)', 'error': false},
	{'code': 'new String()', 'error': false},
	{'code': 'new Promise(function(resolve, reject) {});', 'error': false},
	{'code': 'new Array();', 'error': false},
	{'code': 'new Set();', 'error': false},
	{'code': 'new Map();', 'error': false},
	{'code': 'new Event(4);', 'error': false},
	{'code': 'new Date();', 'error': false},
	{'code': 'import("./A");', 'error': false},
	{'code': 'DataView', 'error': false},
	{'code': 'DOMException', 'error': false},
	{'code': 'ArrayBuffer', 'error': false},
	{'code': 'throw new Error();', 'error': false},
	{'code': '((x) => console.log(x))("hi")', 'error': false},
	{'code': '((x) => console.log(x))("hi"); x = 5', 'error': true},
	{'code': '(enumKey, index) => enumKey = index', 'error': false},
	{'code': '((enumKey, index) => enumKey = index)(1, 2); console.log(index);', 'error': true},
	{'code': '(x => console.log(x))("hi")', 'error': false},
	{'code': 'x = 4;', 'error': true},
	{'code': '[x]', 'error': true},
	{'code': 'x.y = 4;', 'error': true},
	{'code': 'x[3] = 4;', 'error': true},
	{'code': 'x();', 'error': true},
	{'code': 'const x = 4; x=5;', 'error': false},
	// invalid JavaScript but not because of an undefined identifier

	{'code': 'const x = 4; X=5;', 'error': true},
	{'code': 'atob', 'error': false},
	{'code': 'btoa', 'error': false},
	{'code': 'Worker', 'error': false},
	{'code': 'TouchList', 'error': false},
	{'code': 'isNaN(3)', 'error': false},
	{'code': 'NaN', 'error': false},
	{'code': 'const sym1 = Symbol();', 'error': false},
	{'code': 'throw new TypeError("Hello");', 'error': false},
	{'code': 'const hugeHex = BigInt("0x1fffffffffffff");', 'error': false},
	{'code': `let x = '';
for (var name in this)
    x += name + "\n";`, 'error': false},
	{'code': 'navigator.clipboard', 'error': false},
	{'code': 'Clipboard', 'error': false},
	{'code': 'RegExp', 'error': false},
	{'code': 'localStorage', 'error': false},
	{'code': 'console.log(parseFloat("32.3"))', 'error': false},
	{'code': 'console.log(parseInt("4"))', 'error': false},
	{'code': 'const x = x;', 'error': true},
	{'code': 'const x = y;', 'error': true},
	{'code': 'console.log(x); const x = 4;', 'error': true},
	{'code': 'while (true) { console.log(x); const x = 4;}', 'error': true},
	{'code': 'while (true) { console.log(x); let x = 4;}', 'error': true},
	{'code': 'while (true) { console.log(x); function f() { let x = 4; }}', 'error': true},
	{'code': 'console.log(x); function f() { let x = 4; }', 'error': true},
	{'code': 'for (let x in []) {}', 'error': false},
	{'code': 'for (const pType of []) {}', 'error': false},
	{'code': 'for (const [pType, dType] of []) {}', 'error': false},
	{'code': `for (var i = 0; i < 4; i++)
			console.log(i);`, 'error': false},
	{'code': `function arraysEqual(a1, a2) {
		if (a1.length !== a2.length)
			return false;
		for (var i = 0; i < a1.length; i++)
			if (!Object.equals(a1[i], a2[i]))
				return false;

		return true;
	}`, 'error': false},
	{'code': 'function f() { let x = 4; } console.log(x);', 'error': true},
	{'code': 'function f(x) { x = 4; }', 'error': false},
	{'code': 'function f(...args) { console.log(args.length); }', 'error': false},
	{'code': 'function f(x) { } x = 4', 'error': true},
	{'code': 'function f() { console.log(arguments.length);}', 'error': false},
	{'code': `class A {
	constructor(val) {
		val = [255, arguments[0], arguments[1], arguments[2]];
	}}`, 'error': false},
	{'code': 'try { } catch (e) {}', 'error': false},
	{'code': 'try { } catch (e) {console.log(e);}', 'error': false},
	{'code': `for (let i = 0; i < 4; i++) {
	console.log(i);
}`, 'error': false},
{'code': `function p() {
	if (true)
		throw new Error();
	const result = 1;
	{
	}
	return result;
}`, 'error': false},
{'code': `function f() {
	return A.x;
}

class A {
	static x = 4;
}`, 'error': false},
{'code': `class A {
	static x = 4;
}
function f() {
	return A.x;
}`, 'error': false},
	{'code': `export class AsyncCommands {
	async readJson(url) {
		console.log(url);
	}
};`, 'error': false},
	{'code': `(x => x === '' ? '' : ' ' + x)('hi')`, 'error': false},
	{'code': `const [borderWidth, borderHeight] = [1,2];`, 'error': false},
	{'code': `function A() {
	f();
}
function f() {}`, 'error': false},
	{'code': `const settings = {
		'f': function() {
			settings.f();
		}
	}`, 'error': false},
	{'code': `const [x, ...y] = [];`, 'error': false},
	{'code': `const settings = {
		'warn': function(msg) {
			console.log(typeof settings);
	};`, 'error': false}
	];
	processTestCases(cases, validateUndefinedIdentifiers, logger);
};