function canMixReturnTypesBeEvaluated(typesKnown) {
	return typesKnown[0] && typesKnown[1];
}

const checkers = {
	'mix': canMixReturnTypesBeEvaluated
};

/*
typesKnown should be an Array of boolean values.
*/
export function canTypesBeEvaluatedFromPartialInputs(commandName, typesKnown) {
	const checker = checkers[commandName];
	if (checker === undefined)
		return false;

	return checker(typesKnown);
};