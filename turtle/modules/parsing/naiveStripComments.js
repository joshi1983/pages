function removeSingleLineComment(line) {
	const index = line.indexOf(';');
	if (index === -1)
		return line;
	else
		return line.substring(0, index);
}

/*
This ignores rare cases such as where semicolons are
in long string literals.
The incorrectness of this is unpleasant but
outweighed by the speed benefits in average cases.
It is rare to have semicolons in string literals in Logo code too so this will work 
correctly for the vast majority of Logo programs.
*/
export function naiveStripComments(code) {
	return code.split('\n').map(removeSingleLineComment).join('\n');
};