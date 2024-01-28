import { getCommandForPythonOperator } from '../translation-to-weblogo/type-processors/helpers/getCommandForPythonOperator.js';
import { isSameOperatorInWebLogo } from '../translation-to-weblogo/type-processors/helpers/isSameOperatorInWebLogo.js';
import { pythonOperatorToWebLogoOperator } from '../translation-to-weblogo/type-processors/helpers/pythonOperatorToWebLogoOperator.js';

export function isPythonOperator(s) {
	if (s === '<>')
		return false; // <> is an operator in WebLogo but not in Python.
	if (getCommandForPythonOperator(s) !== undefined)
		return true;
	if (isSameOperatorInWebLogo(s))
		return true;
	if (s === '//')
		return true;
	return s !== pythonOperatorToWebLogoOperator(s);
};