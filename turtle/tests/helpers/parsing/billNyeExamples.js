import { fetchText } from '../../../modules/fetchText.js';

/*
Bill Nye is a huge work in progress but we want to test with them and maintain
them consistently with the rest of WebLogo until it is complete and becomes an official example in 
json/scriptExamples.json.
*/

export const billNyeExampleFiles = [
'bill-nye-chin.lgo',
'bill-nye-ear.lgo',
'bill-nye-face.lgo',
'bill-nye-face-no-ear.lgo',
'bill-nye-lips.lgo',
'bill-nye-neck-only.lgo',
'bill-nye-top-hair.lgo'
].map(name => 'art/' + name);

const billNyeExamples = [];
for (let filename of billNyeExampleFiles) {
	billNyeExamples.push(await fetchText('logo-scripts/' + filename));
}

export { billNyeExamples };