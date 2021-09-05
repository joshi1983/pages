import { formatNumber } from '../../../formatNumber.js';

/*
0.001 degrees is such a small number that it won't 
make a visible difference to a drawing.
0.1 degrees would be subtly visible in some cases so 
we don't want to round that much.
0.01 would safely not show but an extra digit seems 
worth keeping to be completely safe.
*/
export function formatDegreesValue(val) {
	return formatNumber(val, 3);
};