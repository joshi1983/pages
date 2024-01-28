import { Dialog } from '../components/Dialog.js';
import { fetchText } from '../fetchText.js';
const aboutHTML = await fetchText('content/help/about.html');

function showAboutDialog() {
	Dialog.show(aboutHTML, 'About WebLogo', 450, 300, {
		'disableResize': true
	});
}

function initAbout() {
	var item = document.getElementById('help-about');
	item.addEventListener('click', showAboutDialog);
}

initAbout();