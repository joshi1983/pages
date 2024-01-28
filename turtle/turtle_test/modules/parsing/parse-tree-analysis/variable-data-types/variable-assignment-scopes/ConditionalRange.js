import { DataTypes } from '../../../data-types/DataTypes.js';

import { simpleContains } from '../simpleContains.js';

/*
A ConditionalRange is part of a VariableAssignmentScope that 
may be executed if specific data types are checked on the associated variable.

This may be used if a condition involves number?, list?, string?.
Procedure parameters are sometimes analyzed as if its caller's data types 
are the only assignable values and types but these paramaters might be called with other types too.
Analyzing parameters using their assigned data types is generally helpful.
After number?, list?, string?... are checked, it is also helpful to assume the types are whatever satisfies the condition.
*/
export class ConditionalRange {
	/*
	conditionToken could be an "if", "while"... token associated with a condition on data types.
	fromToken is the first token in the associated instruction list that pertains to this range.
	toToken is the last token in the associated instruction list that pertains to this range.
	satisfyingDataTypes is a DataTypes instance that describes all data types that might satisfy the condition.
	It should never be all data types because the ConditionalRange would have no reason to exist then.
	*/
	constructor(conditionToken, fromToken, toToken, satisfyingDataTypes) {
		if (!(satisfyingDataTypes instanceof DataTypes))
			throw new Error(`satisfyingDataTypes must be an instance of DataTypes but got ${satisfyingDataTypes}`);
		this.conditionToken = conditionToken;
		this.fromToken = fromToken;
		this.toToken = toToken;
		this.satisfyingDataTypes = satisfyingDataTypes;
	}

	containsTokenLocation(token) {
		return simpleContains(this, location);
	}
};