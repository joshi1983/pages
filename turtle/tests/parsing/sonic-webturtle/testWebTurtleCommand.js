import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { WebTurtleCommand } from '../../../modules/parsing/sonic-webturtle/WebTurtleCommand.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testCouldArgBeStringLiteral(logger) {
	const cases = [
	{'name': 'color', 'index': 0, 'out': false},
	{'name': 'draw', 'index': 0, 'out': false},
	{'name': 'repeat', 'index': 0, 'out': false},
	{'name': 'repeat', 'index': 1, 'out': false},
	{'name': 'let', 'index': 0, 'out': false}, 
	// variable reference is not the same as a string literal.

	{'name': 'let', 'index': 1, 'out': true},
	{'name': 'turtleprint', 'index': 0, 'out': true},
	{'name': 'print', 'index': 0, 'out': true},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, name=${caseInfo.name}`, logger);
		const info = WebTurtleCommand.getCommandInfo(caseInfo.name);
		if (info === undefined)
			plogger(`Expected to get info for a command named ${caseInfo.name} but did not`);
		else {
			const result = WebTurtleCommand.couldArgBeStringLiteral(info, caseInfo.index);
			if (result !== caseInfo.out)
				plogger(`Expected ${caseInfo.out} but got ${result}`);
		}
	});
}

export function testWebTurtleCommand(logger) {
	wrapAndCall([
		testCouldArgBeStringLiteral
	], logger);
};