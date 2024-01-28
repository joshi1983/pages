export function processSeeAlsoCommands(operatorInfo) {
	const operatorSeeAlsoCommands = document.getElementById('operator-see-also-commands');
	if (operatorInfo.seeAlsoCommands.length !== 0) {
		const prefixSpan = document.createElement('span');
		prefixSpan.classList.add('prefix');
		prefixSpan.innerText = 'See also the following commands: ';
		operatorSeeAlsoCommands.appendChild(prefixSpan);
		const commands = operatorInfo.seeAlsoCommands;
		for (let i = 0; i < commands.length; i++) {
			const span = document.createElement('span');
			span.classList.add('command');
			span.innerText = commands[i];
			if (i > 0) {
				const commaNode = document.createTextNode(', ');
				operatorSeeAlsoCommands.appendChild(commaNode);
			}
			operatorSeeAlsoCommands.appendChild(span);
		}
	}
};