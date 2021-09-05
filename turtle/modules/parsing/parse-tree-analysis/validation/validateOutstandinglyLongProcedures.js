export function validateOutstandinglyLongProcedures(cachedParseTree, parseLogger) {
	const procs = cachedParseTree.getProceduresMap();
	for (const proc of procs.values()) {
		const startToken = proc.getStartToken();
		const endToken = proc.getEndToken();
		const name = proc.nameToken.val;
		if (endToken !== undefined && startToken !== undefined &&
		endToken.lineIndex > startToken.lineIndex + 200) {
			parseLogger.warn(`Procedure ${name} is ${endToken.lineIndex - startToken.lineIndex} lines long which is unusually long.  Such exceptional length in a single procedure can make the procedure harder to understand.  Consider moving some code out of procedure ${name} or refactor duplicated code into loops.  Some sections of code could be more understandable if moved to new and appropriately named procedures.`,
			startToken);
		}
	}
};