console.log('before import showLoadExampleDialog');
import { showLoadExampleDialog } from './file-load-example/showLoadExampleDialog.js';
console.log('after import showLoadExampleDialog');

function fileLoadExampleItemClicked() {
	showLoadExampleDialog();
}

const fileLoadExampleItem = document.getElementById('file-load-example');
console.log(`fileLoadExampleItem = ${fileLoadExampleItem}`);
fileLoadExampleItem.addEventListener('click', fileLoadExampleItemClicked);
console.log(`file-load-example click binding processed.`);