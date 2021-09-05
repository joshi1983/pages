/*
Shows a tip every time the page loads, if one is appropriate based on what is in local storage.
*/
import { Code } from '../components/code-editor/Code.js';
import { EditorLocalStorage } from '../components/code-editor/EditorLocalStorage.js';
import { fetchText } from '../fetchText.js';
import { setTipContent } from '../components/loading-dialog/LoadingDialog.js';
import { TimeLocalStorage } from '../set/animation-time/TimeLocalStorage.js';
import { wasScriptExampleUsed } from '../file/file-load-example/ScriptExampleLocalStorage.js';
import { wasTutorialUsed } from './tutorialLocalStorage.js';

async function showTip(id) {
	const wrapperHTML = await fetchText('content/help/tips/tip-wrapper.html');
	const filename = `content/help/tips/${id}.html`;
	fetchText(filename).then(function(html) {
		setTipContent(wrapperHTML);
		const container = document.getElementById('tip-content');
		container.innerHTML = html;
	});
}

function isSetTimeTipAppropriate() {
	if (TimeLocalStorage.isUsed())
		return false;

	const code = Code.getSourceCode().toLowerCase();
	return code.indexOf('animation.setup') !== -1;
}

function initialTip() {
	if (!wasTutorialUsed())
		showTip("tutorial");
	else if (!wasScriptExampleUsed())
		showTip('examples');
	else if (!EditorLocalStorage.wasEditorOpened())
		showTip('code-editor');
	else if (!EditorLocalStorage.wereBreakpointsUsed())
		showTip('breakpoints');
	else if (isSetTimeTipAppropriate())
		showTip('set-time');
}

initialTip();