import { CodeEditor } from
'../../components/CodeEditor.js';
import { getImageAssetCode } from
'./getImageAssetCode.js';

export async function addImageAssetToCode(asset) {
	let code = CodeEditor.getSourceCode() + '\n' + await getImageAssetCode(asset);
	CodeEditor.textElement.setValue(code);
};