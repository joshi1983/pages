import { formatNumber } from '../../../formatNumber.js';

/*
If 1 = 1/72 of an inch on paper, the following rounding 
and formatting is reasonably accurate without making the .ps look messy with unneeded precision 
and exponential forms such as '1e-15'.

The following rounds to the nearest 2 decimal points which would translate to an error in the order of 1/7200 of an inch.
In other words, this can lead to an error you will not notice on a printed page.
*/
export function formatPointsValue(val) {
	return formatNumber(val, 2);
};