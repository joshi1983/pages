import { loadScript } from './embed/loadScript.js';

async function loadWebLogoScripts() {
	const scripts = document.querySelectorAll('script[type="application/weblogo"]');
	for (let i = 0; i < scripts.length; i++) {
		const script = scripts[i];
		await loadScript(script);
	}
}

await loadWebLogoScripts();

