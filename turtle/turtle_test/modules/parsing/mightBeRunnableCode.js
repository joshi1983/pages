/*
Checks if the specified code might define a runnable program.

The result might be correct but the main requirement here is to 
perform extremely fast even if there is a lot of code.
To keep the performance very high with large code, 
we're not parsing or even scanning the code.

We're looking very superficially.
The deepest processing we're doing is ignoring comments.
*/
export function mightBeRunnableCode(code) {
	const trimmed = code.trim();
	if (trimmed === '')
		return false;
	if (trimmed.charAt(0) !== ';')
		return true;
	let index = 0;
	while (true) {
		const lineBreakIndex = trimmed.indexOf('\n', index + 1);
		let line;
		if (lineBreakIndex === -1)
			line = trimmed.substring(index);
		else
			line = trimmed.substring(index, lineBreakIndex);
		const commentIndex = line.indexOf(';');
		if (commentIndex !== -1)
			line = line.substring(0, commentIndex);
		if (line.trim() !== '')
			return true;
		index = lineBreakIndex;
		if (lineBreakIndex === -1)
			return false;
	}
};