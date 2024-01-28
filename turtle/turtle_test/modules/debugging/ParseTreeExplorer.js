import { Dialog } from '../components/Dialog.js';
import { fetchText } from '../fetchText.js';
import { ParseTreeToken } from '../parsing/ParseTreeToken.js';
import { parseTreeTokenToElement } from './parse-tree-explorer/parseTreeTokenToElement.js';
import { ParseTreeTokenType } from '../parsing/ParseTreeTokenType.js';
import { Settings } from '../Settings.js';
const explorerHTML = await fetchText('content/debugging/parseTreeExplorer.html');

function showExplorer() {
	Dialog.show(explorerHTML, 'Parse Tree Explorer', 450, 300, {
		'helpID': 'parsetree'
	});
	const container = document.getElementById('parse-tree-explorer');
	const token = Settings.executer.executionContext.logoProgram.parseTree;
	if (token instanceof ParseTreeToken) {
		const treeRootElement = parseTreeTokenToElement(token, ParseTreeTokenType);
		container.innerHTML = '';
		container.appendChild(treeRootElement);
	}
	else {
		container.innerHTML = 'No parse tree is available.  You may want to hit "Test!" in the Code Editor.';
	}
}

class PrivateParseTreeExplorer {
	show() {
		showExplorer();
	}
}

const ParseTreeExplorer = new PrivateParseTreeExplorer();
export { ParseTreeExplorer };