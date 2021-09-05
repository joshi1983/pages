import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getRequiredTypesForVariableAtToken } from
'../../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/variable-data-types/getRequiredTypesForVariableAtToken.js';
import { parse } from
'../../../../../../modules/parsing/qbasic/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testVariableNameSuffix(logger) {
	const cases = [
	{'code': 'x$', 'result': 'string'},
	{'code': 'x%', 'result': 'int'},
	{'code': 'x!', 'result': 'num'},
	{'code': 'x&', 'result': 'int'},
	{'code': 'x#', 'result': 'num'}
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const children = parseResult.root.children;
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		if (children.length !== 1) {
			plogger(`Expected exactly 1 child of TREE_ROOT but found ${children.length}`);
			return;
		}
		const varToken = children[0];
		if (varToken.type !== ParseTreeTokenType.IDENTIFIER) {
			plogger(`Expected the only child of TREE_ROOT to be an IDENTIFIER but found token type ${ParseTreeTokenType.getNameFor(varToken.type)}`);
			return;
		}
		const result = getRequiredTypesForVariableAtToken(varToken.val.toLowerCase(), varToken);
		if (result !== caseInfo.result)
			plogger(`Expected result of ${caseInfo.result} but found ${result}`);
	});
}

function testWithX(logger) {
	const cases = [
	{'code': `print HERE
print x * 4`,
	'result': 'num'},
	{'code': `print HERE
print 2 ^ x`,
	'result': 'num'},
	{'code': `print HERE
sleep x`,
	'result': 'num'},
	{'code': `print HERE
screen x`,
	'result': 'int'},
	{'code':  'x = HERE + x / 100',
	'result': 'num'},
	{'code':  `sub p(x AS Integer)
print HERE
end sub`,
	'result': 'int'},
	{'code':  `sub p(x AS Long)
print HERE
end sub`,
	'result': 'int'},
	{'code':  `sub p(x AS String)
print HERE
end sub`,
	'result': 'string'},
	{'code':  `sub p(x as Single)
print HERE
end sub`,
	'result': 'num'},
	{'code':  `sub p(x as Double)
print HERE
end sub`,
	'result': 'num'},
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const hereToken = findToken({'val': 'HERE', 'type': ParseTreeTokenType.IDENTIFIER},
			tokens, plogger);
		if (hereToken === undefined)
			return;
		const result = getRequiredTypesForVariableAtToken('x', hereToken);
		if (result !== caseInfo.result)
			plogger(`Expected result of ${caseInfo.result} but found ${result}`);
	});
}

export function testGetRequiredTypesForVariableAtToken(logger) {
	wrapAndCall([
		testVariableNameSuffix,
		testWithX
	], logger);
};