import { messageToDivNoProcessLinks } from '../../modules/components/messageToDivNoProcessLinks.js';

// Input msg should be a message structured like the ones in a BufferedParseLogger.
export function messageToDiv(msg) {
	const row = document.createElement('div');
	const msgDiv = messageToDivNoProcessLinks(msg.msg, msg.type, msg.isHTML);
	msgDiv.classList.add('msg');
	const lineNum = document.createElement('div');
	lineNum.innerText = '' + msg.token.lineIndex;
	lineNum.classList.add('line-number');
	row.appendChild(lineNum);
	row.appendChild(msgDiv);
	return row;
};