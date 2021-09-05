import { fileStatusCompleted, setFileStatusTitle } from
'../components/loading-dialog/FileMenuStatus.js';

const modules = [
	'./fileAssets.js',
	'./fileDownload.js',
	'./fileEdit.js',
	'./fileLoad.js',
	'./fileLoadExample.js',
	'./fileNew.js'
];
for (const module of modules) {
	await import(module);
	setFileStatusTitle(`Loaded module ${module}`);
}
fileStatusCompleted();