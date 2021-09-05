export function exceptionToString(e) {
	let msg = '';
	if (e.details && e.details.e) {
		const instruction = e.details.instruction;
		e = e.details.e;
		if (e.message)
			msg = e.message;
		if (instruction && instruction.parseTreeToken) {
			const parseTreeToken = instruction.parseTreeToken;
			msg += ' line ' + parseTreeToken.lineIndex;
		}
	}
	else if (e.message)
		msg = e.message;
	return msg;
};