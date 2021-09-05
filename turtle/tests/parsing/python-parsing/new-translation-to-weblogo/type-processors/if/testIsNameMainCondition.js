import { getDescendentsOfType } from
'../../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { isNameMainCondition } from
'../../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/type-processors/if/shouldRemoveCondition.js';
import { parse } from
'../../../../../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedIsNameMainCondition(logger) {
	return function(code) {
		const parseResult = parse(code);
		const tokens = getDescendentsOfType(parseResult.root, ParseTreeTokenType.IF_STATEMENT);
		if (tokens.length !== 1)
			logger(`Expected 1 if-statement but found ${tokens.length} in Python code: ${code}`);
		else {
			const ifToken = tokens[0];
			const conditionToken = ifToken.children[0];
			if (conditionToken === undefined) 
				logger(`A condition is expected in the if-statement but none was found. Python code: ${code}`);
			return isNameMainCondition(conditionToken);
		}
	};
}

export function testIsNameMainCondition(logger) {
	const cases = [
		{'in': 'if x:\n\tf()', 'out': false},
		{'in': `if __name__ == "bla":`, 'out': false},
		{'in': 'def f():\n\tif __name__ == "__main__":\n\t\treturn', 'out': true},
		{'in': 'if __name__ == "__main__":\n\tf()', 'out': true}
	];
	testInOutPairs(cases, wrappedIsNameMainCondition(logger), logger);
};