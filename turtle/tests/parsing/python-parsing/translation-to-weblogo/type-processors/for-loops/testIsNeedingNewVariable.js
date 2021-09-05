import { isNeedingNewVariable } from
'../../../../../../modules/parsing/python-parsing/translation-to-weblogo/type-processors/for-loops/isNeedingNewVariable.js';
import { asyncInit, parse } from
'../../../../../../modules/parsing/python-parsing/parse.js';
import { ParseTreeTokenType } from '../../../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../../../helpers/prefixWrapper.js';
await asyncInit();

function getForToken(node) {
	if (node.type === ParseTreeTokenType.FOR_LOOP)
		return node;
	const children = node.children;
	for (let i = 0; i < children.length; i++) {
		const forToken = getForToken(children[i]);
		if (forToken !== undefined)
			return forToken;
	}
}

export function testIsNeedingNewVariable(logger) {
	const cases = [
	{'in': 'for i in range(5)', 'out': false},
	{'in': 'for i in range(1,5)', 'out': false},
	{'in': 'for i in range(1,5,2)', 'out': false},
	{'in': 'for i in x', 'out': false},
	{'in': 'for i in [1, 5, 6]', 'out': true},
	{'in': 'for i in (1, 5, 6)', 'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const code = `${caseInfo.in}:\n\tpass`;
		const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.in}`, logger);
		const tree = parse(code);
		const forToken = getForToken(tree);
		if (forToken === undefined)
			plogger('Expected to find for-loop but unable to find one.');
		else {
			const result = isNeedingNewVariable(forToken);
			if (result !== caseInfo.out)
				plogger(`Expected ${caseInfo.out} but got ${result}`);
		}
	});
};