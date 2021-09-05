import { ParseTreeTokenType } from '../modules/parsing/python-parsing/ParseTreeTokenType.js';

function pairToDiv(key, name) {
	const result = document.createElement('div');
	result.classList.add('pair');
	const keyDiv = document.createElement('div');
	const nameDiv = document.createElement('div');
	keyDiv.innerText = '' + key;
	nameDiv.innerText = name;
	result.appendChild(keyDiv);
	result.appendChild(nameDiv);
	return result;
}

function bindParseTreeTokenTypeLookup() {
	const input = document.getElementById('parse-token-type-lookup');
	const out = document.getElementById('parse-token-type-results');
	function refreshDisplay() {
		const val = parseInt(input.value);
		out.innerText = '';
		if (!isNaN(val)) {
			for (let i = Math.max(0, val - 3); i < val + 3; i++) {
				const name = ParseTreeTokenType.getNameFor(i);
				if (name !== undefined) {
					out.appendChild(pairToDiv(i, name));
				}
			}
		}
	}
	input.addEventListener('input', refreshDisplay);
	refreshDisplay();
}

bindParseTreeTokenTypeLookup();
console.log('python-troubleshooting...');