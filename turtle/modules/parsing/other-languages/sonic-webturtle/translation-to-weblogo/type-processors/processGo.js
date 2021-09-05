export function processGo(token, result, settings) {
	result.processCommentsUpToToken(token);
	if (token.children.length !== 0) {
		let procName = token.children[0].val;
		if (procName) {
			let translatedProcName = settings.procedureRenameMap.get(procName.toLowerCase());
			procName = translatedProcName;
		}
		result.trimRight();
		result.append('\n' + procName + '\n');
	}
	else {
		result.append('; Translation failed for go\n');
		result.append(`; because 1 parameter expected but got ${token.children.length}\n`);
	}
};