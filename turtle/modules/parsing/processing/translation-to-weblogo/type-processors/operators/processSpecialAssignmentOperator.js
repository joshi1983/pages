import { moduloAssignment } from './moduloAssignment.js';

const specials = new Map([
	['%=', moduloAssignment],
]);

export function processSpecialAssignmentOperator(token, result, settings) {
	const f = specials.get(token.val);
	if (f !== undefined) {
		f(...arguments);
		return true;
	}
};