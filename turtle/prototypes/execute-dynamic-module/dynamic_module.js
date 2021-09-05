import { ready } from
'../../modules/ready.js';

const testCode = `export function func() {
	const div = document.querySelector('div');
	div.innerText = 'it worked.  This is from code run in a string.';
};`;
const dataUrl = 'data:text/javascript;base64,'+btoa(testCode);

async function init() {
	const importedModule = await import(dataUrl);
	importedModule.func();
}

ready(init);