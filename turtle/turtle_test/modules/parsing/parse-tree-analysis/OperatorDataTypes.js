import { Operators } from '../Operators.js';

function isNumeric(val) {
	return val === 'int' || val === 'num';
}

const ops = {
	'*': function(operand1Types, operand2Types) {
		if (operand1Types === 'int' && operand2Types === 'int')
			return 'int';
		return 'num';
	},
	'+': function(operand1Types, operand2Types) {
		if (operand1Types === 'string' || operand2Types === 'string')
			return 'string';
		if (operand1Types === 'int' && operand2Types === 'int')
			return 'int';
		if (isNumeric(operand1Types) && isNumeric(operand2Types))
			return 'num';

		return 'num';
	},
	'-': function(operand1Types, operand2Types) {
		if (operand1Types === 'int' && operand2Types === 'int')
			return 'int';
		return 'num';
	}
};

class PrivateOperatorDataTypes {
	getReturnTypesForBinaryInputTypes(symbol, operand1Types, operand2Types) {
		if (ops[symbol] !== undefined)
			return ops[symbol](operand1Types, operand2Types);
		const info = Operators.getOperatorInfo(symbol);
		return Operators.getBinaryReturnTypes(info);
	}

	isReturnTypesAffectedByBinaryInputTypes(symbol) {
		return ops[symbol] !== undefined;
	}

	isReturnTypesAffectedByUnaryInputTypes(symbol) {
		return symbol === '-';
	}

	getReturnTypesForUnaryInputTypes(symbol, operand1Types) {
		if (symbol === '-') {
			if (operand1Types === 'int')
				return 'int';
			return 'num';
		}
		const info = Operators.getOperatorInfo(symbol);
		return Operators.getUnaryReturnTypes(info);
	}
};

const OperatorDataTypes = new PrivateOperatorDataTypes();
export { OperatorDataTypes };