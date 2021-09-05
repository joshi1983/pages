/*
This is intended to be run through command line using nodejs.

This makes .html files for examples more consistent.
*/

const fs = require("fs");
const nhp = require('node-html-parser');

function removeIfEmpty(textNode) {
	if (textNode.rawText === '') {
		textNode.parentNode.removeChild(textNode);
	}
}

// Function to get current filenames
// in directory
let filenames = fs.readdirSync(".");
const encoding = 'utf8';

filenames.forEach((file) => {
	if (file.endsWith(".html")) {
		fs.readFile(file, encoding, (err,html)=>{
			if(err){
				throw err;
			}
			const root = nhp.parse(html);
			const codes = root.querySelectorAll('code');
			let edited = false;
			codes.forEach(function(codeElement) {
				let recentlyEdited = true;
				while (recentlyEdited) {
					recentlyEdited = false;
					const firstChild = codeElement.firstChild;
					const lastChild = codeElement.lastChild;
					if (firstChild instanceof nhp.TextNode) {
						const newText = firstChild.rawText.trimStart();
						if (newText !== firstChild.rawText) {
							firstChild.rawText = newText;
							removeIfEmpty(firstChild);
							recentlyEdited = true;
						}
					}
					else if (firstChild.tagName === 'BR') {
						firstChild.parentNode.removeChild(firstChild);
						recentlyEdited = true;
						console.log('removing first child because it is a BR element');
					}
					if (lastChild instanceof nhp.TextNode) {
						const newText = lastChild.rawText.trimEnd();
						if (newText !== lastChild.rawText) {
							lastChild.rawText = newText;
							removeIfEmpty(lastChild);
							recentlyEdited = true;
						}
					}
					else if (lastChild.tagName === 'BR') {
						lastChild.parentNode.removeChild(lastChild);
						recentlyEdited = true;
					}
					if (recentlyEdited)
						edited = true;
				}
			});
			if (edited) {
				fs.writeFile(file, root.toString(), function() {
					console.log('sanitized with changes to file ' + file);
				});
			}
		});
	}
});
