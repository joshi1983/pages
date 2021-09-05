import { DataTypes } from
'../../data-types/DataTypes.js';
import { MaybeDecided } from
'../../../MaybeDecided.js';

await DataTypes.asyncInit();
const numTypes = new DataTypes('num');
const finiteTypes = new DataTypes('num(finite)');
const unfiniteTypes = new DataTypes('num(unfinite)');

export function getTypesForDivision(token, rightOperandIsZero) {
	if (token.children.length !== 2)
		return numTypes;

	const leftChild = token.children[0];
	const rightChild = token.children[1];
	if (rightChild.val === 0 || rightOperandIsZero === MaybeDecided.Yes)
		return unfiniteTypes; // dividing any value by 0 returns a num(unfinite).
		// That's why we don't care what leftChild evaluates to in this case.
		// 0/0, 1/0, -1/0, 5/0... are all part of the num(unfinite) value set.

	if (Number.isFinite(rightChild.val)) {
		if (Number.isFinite(leftChild.val))
			return finiteTypes;

		// FIXME: look for other cases where we know leftChild evaluates to a finite number(num(finite)).
	}

	return numTypes;
};