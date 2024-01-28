/*
This module is to help with keyboard-navigation of WebLogo.

Currently, only the main menus are navigatable.
For example, you can tab to "File", "Set"... but 
can not tab to items within these menus.

Ideally, we want to navigate through all items similar to what is demonstrated in:
https://www.youtube.com/watch?v=YT6a_vp2Es0
but this work isn't that complete yet.

This work may continue with help from reading:
https://pressbooks.library.ryerson.ca/wafd/chapter/tree-menus/
*/
let tabIndexCounter = 1;

function tabMainMenuItem(e) {
	if (e.tagName !== 'UL')
		e.setAttribute('tabindex', 0);
	for (let n = e.firstChild; n !== null; n = n.nextSibling) {
		if (n.tagName === 'LI' || n.tagName === 'UL') {
			tabMainMenuItem(n);
		}
	}
}

function tabMainMenuItems() {
	const menu = document.querySelector('#menu-bar > ul');
	tabMainMenuItem(menu);
}

class PrivateTabIndexManager {
	constructor() {
		tabMainMenuItems();
	}
};

const TabIndexManager = new PrivateTabIndexManager();
export { TabIndexManager };