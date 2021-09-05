import { addImageAssetToCode } from './addImageAssetToCode.js';
import { Code } from
'../../components/code-editor/Code.js';
import { CodeEditor } from
'../../components/CodeEditor.js';
import { ImageAssetViewer } from './asset-viewers/ImageAssetViewer.js';
import { ToastMessages } from
'../../components/ToastMessages.js';

export function shouldShowAddToCodeButton(viewer) {
	if (viewer instanceof ImageAssetViewer)
		return true;
	return false;
};

export function addAssetToCode(asset, viewer) {
	if (viewer instanceof ImageAssetViewer)
		addImageAssetToCode(asset);
	else
		throw new Error(`Unsupported type of asset for adding to code`);

	const code = Code.getSourceCode();
	CodeEditor.textElement.setCursorPosition(0, code.split('\n').length);
	CodeEditor.restore();
	ToastMessages.success(`Added code to draw image asset at the bottom of the code editor`, false);
};