import { showLoadExampleDialog } from './file-load-example/showLoadExampleDialog.js';

function fileLoadExampleItemClicked() {
	showLoadExampleDialog();
}

const fileLoadExampleItem = document.getElementById('file-load-example');
fileLoadExampleItem.addEventListener('click', fileLoadExampleItemClicked);