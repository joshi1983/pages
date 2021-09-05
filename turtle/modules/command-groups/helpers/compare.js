export function compare(val1, val2) {
	if (val1 < val2)
		return -1;
	else if (val1 === val2)
		return 0;
	else
		return 1;
};