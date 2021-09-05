export function preferNonNullVal(tok1, tok2) {
	if ((tok1.val === null) === (tok2.val === null))
		return 0;
	if (tok1.val === null)
		return -1;
	else
		return 1;
};