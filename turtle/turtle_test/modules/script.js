function init() {
	import('./Settings.js');
	import('./components/TabIndexManager.js');
}

if (document.readyState === 'loading')
	document.addEventListener('DOMContentLoaded', init);
else
	init();