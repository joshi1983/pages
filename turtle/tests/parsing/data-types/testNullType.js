import { NullType } from '../../../modules/parsing/data-types/NullType.js';

export function testNullType(logger) {
	const nt1 = new NullType();
	const nt2 = new NullType();
	if (!nt1.intersectsWith(nt2))
		logger('Expected to intersect NullType with another NullType but it did not');
};