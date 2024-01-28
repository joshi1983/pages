import { bindIntermediateCodeExplorer } from './intermediate-code-explorer/bindIntermediateCodeExplorer.js';
import { Dialog } from '../components/Dialog.js';
import { fetchText } from '../fetchText.js';
import { Settings } from '../Settings.js';
const explorerHTML = await fetchText('content/debugging/intermediateCodeExplorer.html');

function showExplorer() {
	Dialog.show(explorerHTML, 'Intermediate Code Explorer', 450, 300, {
		'helpID': 'intermediatecode'
	});
	const logoProgram = Settings.executer.executionContext.logoProgram;
	bindIntermediateCodeExplorer(logoProgram);
}

class PrivateIntermediateCodeExplorer {
	show() {
		showExplorer();
	}
}

const IntermediateCodeExplorer = new PrivateIntermediateCodeExplorer();
export { IntermediateCodeExplorer };