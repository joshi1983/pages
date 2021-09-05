export function isInvalidVariableReferenceCharacter(ch) {
	if (ch >= 'a' && ch <= 'z')
		return false;
	if (ch >= '0' && ch <= '9')
		return false;
	if (ch >= 'A' && ch <= 'Z')
		return false;
	if (ch === '_')
		return false;
	return true;
};