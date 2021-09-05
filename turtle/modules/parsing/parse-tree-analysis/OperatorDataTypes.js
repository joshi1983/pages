const ops = new Set(['+', '*', '-']);

class PrivateOperatorDataTypes {
	isReturnTypesAffectedByBinaryInputTypes(symbol) {
		return ops.has(symbol);
	}

	isReturnTypesAffectedByUnaryInputTypes(symbol) {
		return symbol === '-';
	}
};

const OperatorDataTypes = new PrivateOperatorDataTypes();
export { OperatorDataTypes };