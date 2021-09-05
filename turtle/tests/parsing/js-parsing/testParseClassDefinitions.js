import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseClassDefinitions(logger) {
	const cases = [
	{'code': `class SetUtils {
	remove() {
		const toDelete = 2;
	}
}`, 'numTopChildren': 1},
	{'code': `class Utils {
	f1() {
	}

	f2() {
		x = 1;
	}
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.CLASS,
	'val': 'class',
	'children': [
		{'val': 'Utils', 'type': ParseTreeTokenType.IDENTIFIER},
		{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
			{'val': '{'},
			{'val': 'f1'},
			{'val': 'f2'},
			{'val': '}'}
		]}
	]
})},
	{'code': `class B extends A{
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.CLASS,
	'val': 'class',
	'children': [
		{'val': 'B', 'children': [
			{'val': 'extends', 'type': ParseTreeTokenType.EXTENDS, 'children': [
				{'val': 'A', 'type': ParseTreeTokenType.IDENTIFIER}
			]}
		]},
		{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': [
			{'val': '{'},
			{'val': '}'}
		]}
	]
	})},
	{'code': `class Colour extends EventDispatcher {
	static WHITE = 2;
	}`, 'numTopChildren': 1},
	{'code': `class A {}
class B {}`, 'numTopChildren': 2},
	{'code': `class A {
	b() {
		if (true) {
		}
		if (false) {
		}
	}
}`, 'numTopChildren': 1},
	{'code': `class A {
	async m() {}
}`, 'numTopChildren': 1},
	{'code': `class C1 {
	getParseTree() {
		function f1() {
			if (true) {
			}
			else {
			}
			currentToken = 1
		}
		if (true) {
		}
	}
}`, 'numTopChildren': 1},
	{'code': `class CommandLinkProcessor {
	static process() {
	};
}`, 'numTopChildren': 1},
	{'code': `class FunctionRename {
	static isNeededFor() {
		return definitions.some(def => {
			return 2;
		});
	}
}`, 'numTopChildren': 1}
	];
	processParseTestCases(cases, logger);
};