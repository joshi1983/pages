import { dtTokenToParseTreeTokenType } from '../../../../modules/parsing/python-parsing/parse-tree-conversion/dtTokenToParseTreeTokenType.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

function createMockToken(info) {
	const mockProperties = {
		'parentConstructorName': 'TerminalNodeImpl'
	};
	Object.assign(mockProperties, info);
	const result = {
		'parentCtx': {
			'constructor': {
				'name': mockProperties.parentConstructorName
			}
		}
	};
	if (mockProperties.constructorName !== undefined) {
		result.constructor = {'name': mockProperties.constructorName};
	}
	if (mockProperties.text !== undefined)
		result.symbol = {'text': mockProperties.text};
	const keysToCopy = ['invokingState'];
	keysToCopy.forEach(function(key) {
		result[key] = mockProperties[key];
	});
	return result;
}

export function testDtTokenToParseTreeTokenType(logger) {
	const cases = [
	{'in': {'constructorName': 'TerminalNodeImpl', 'text': 'x', 'invokingState': 782},
	'out': ParseTreeTokenType.IDENTIFIER
	}
	];
	cases.forEach(caseInfo => caseInfo.in = createMockToken(caseInfo.in));
	testInOutPairs(cases, dtTokenToParseTreeTokenType, logger);
};