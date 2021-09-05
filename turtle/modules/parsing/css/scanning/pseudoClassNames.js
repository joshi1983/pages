import { fetchText } from '../../../fetchText.js';
const pseudoClassNames = (await fetchText('json/css/pseudo-class-names.txt')).split('\n').map(name => name.trim());

export { pseudoClassNames };