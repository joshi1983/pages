import { Operators } from '../../modules/parsing/Operators.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
await Operators.asyncInit();

function testCanBeUnary(logger) {
	const cases = {
		'-': true,
		'+': false,
		'*': false,
		'/': false,
		'=': false,
		'>=': false,
		'<=': false,
		'<>': false
	};
	for (const key in cases) {
		const result = Operators.canBeUnary(key);
		if (result !== cases[key])
			logger('Expected canBeUnary for ' + key + ' to be ' + cases[key] + ' but got ' + result);
	}
}

function testGetOperatorInfo(logger) {
	const symbols = ['+', '-', '*', '/', '=', '<>', '<', '>', '<=', '>='];
	symbols.forEach(function(symbol) {
		Operators.getOperatorInfo(symbol);
	});
}

function testGetUnaryParameterTypes(logger) {
	const symbols = ['-'];
	function checkTypes(types) {
		if (types === undefined)
			logger('Expected parameter types but got undefined');
	}
	symbols.map(s => Operators.getUnaryParameterTypes(s)).forEach(checkTypes);
	symbols.map(s => Operators.getUnaryParameterTypes(Operators.getOperatorInfo(s))).forEach(checkTypes);
}

function testGetUnaryReturnTypes(logger) {
	const symbols = ['-'];
	function checkTypes(types) {
		if (types === undefined)
			logger('Expected parameter types but got undefined');
	}
	symbols.map(s => Operators.getUnaryReturnTypes(s)).forEach(checkTypes);
	symbols.map(s => Operators.getUnaryReturnTypes(Operators.getOperatorInfo(s))).forEach(checkTypes);
}

export function testOperators(logger) {
	function namedLog(name) {
		return prefixWrapper(name, logger);
	}
	testCanBeUnary(namedLog('testCanBeUnary'));
	testGetOperatorInfo(namedLog('testGetOperatorInfo'));
	testGetUnaryParameterTypes(namedLog('testGetUnaryParameterTypes'));
	testGetUnaryReturnTypes(namedLog('testGetUnaryReturnTypes'));
};