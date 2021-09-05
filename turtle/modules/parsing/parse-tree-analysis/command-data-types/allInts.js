export function allInts(argTypes) {
	for (const types of argTypes) {
		if (types !== 'int')
			return false;
	}
	return true;
};