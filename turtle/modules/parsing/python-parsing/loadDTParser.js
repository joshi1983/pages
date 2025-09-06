import { loadJavaScript } from '../../components/loadJavaScript.js';

export function loadDTParser() {
	return loadJavaScript('lib/dt-python-parser/dt-python-parser.min.js');
	//return loadJavaScript('lib/dt-python-parser/dt-python-parser.js');
	//return loadJavaScript('lib/dt-python-parser/dt-python-parser-source-troubleshooting.js');
	//return loadJavaScript('lib/dt-python-parser/dt-python-parser.min-troubleshooting.js');
};