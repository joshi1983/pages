import { CachedParseTree } from
'../../../../../modules/parsing/processing/parsing/parse-tree-analysis/CachedParseTree.js';
import { parse } from
'../../../../../modules/parsing/processing/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testCachedParseTreeMethods(logger) {
	const cases = [
	{'code': '', 'numMethods': 0},
	{'code': 'int x = 1;', 'numMethods': 0},
	{'code': 'int p() {}', 'methodNames': ['p']},
	{'code': 'class A { int p() {} }', 'methodNames': ['p']},
	{'code': 'void p() {}\nvoid p(int x) {}', 'methodNames': ['p']},
	// p is overloaded with different signature.
	];
	cases.forEach(function(caseInfo, index) {
		if (caseInfo.methodNames !== undefined)
			caseInfo.numMethods = caseInfo.methodNames.length;
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const cachedTree = new CachedParseTree(parseResult.root);
		const methods = cachedTree.methods;
		if (caseInfo.numMethods !== methods.size)
			plogger(`Expected number of methods to be ${caseInfo.numMethods} but got ${methods.size}`);
		else if (caseInfo.methodNames !== undefined) {
			for (const methodName of caseInfo.methodNames) {
				const methodsWithName = methods.get(methodName);
				if (methodsWithName === undefined)
					plogger(`Expected to find at least 1 method with name ${methodName} but did not find any.`);
				else if (!(methodsWithName instanceof Array))
					plogger(`methods should be a Map where each value is an Array but found something other than an Array: ${methodsWithName}`);
			}
		}
	});
};