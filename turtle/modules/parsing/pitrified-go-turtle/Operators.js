import { fetchJson } from '../../fetchJson.js';
import { GenericOperators } from '../generic-parsing-utilities/GenericOperators.js';
import { isAfterOrSame } from '../generic-parsing-utilities/isAfterOrSame.js';
const operators = await fetchJson('json/logo-migrations/pitrified-go-turtle/operators.json');

const Operators = new GenericOperators(operators, []);

Operators.compareOperatorPrecedence = function(op1, op2, token1, token2) {
	op1 = Operators.getOperatorInfo(op1);
	op2 = Operators.getOperatorInfo(op2);
	const result = op1.precedence - op2.precedence;
	if (result === 0) {
		if (isAfterOrSame(token1, token2))
			return -1;
		else
			return 1;
	}
	return result;
};
export { Operators };