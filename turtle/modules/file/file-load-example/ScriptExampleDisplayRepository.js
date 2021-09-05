import { RateLimiter } from '../../RateLimiter.js';
import { ScriptExampleDisplay } from './ScriptExampleDisplay.js';

// a map from example URL to ScriptExampleDisplay.
const examplesMap = new Map();

class PrivateScriptExampleDisplayRepository {
	get(url) {
		if (typeof url !== 'string')
			throw new Error('url must be a string.  Not: ' + url);
		if (!examplesMap.has(url)) {
			examplesMap.set(url, new ScriptExampleDisplay(url));
		}
		return examplesMap.get(url);
	}

	resized() {
		for (const [key, value] of examplesMap) {
			// draw using timeout to help the UI stay responsive since the redraw can be slow.
			RateLimiter.run('ScriptExampleDisplayRepository-' + key, function() {
				value.resized();
			}, 100);
		}
	}
}

const ScriptExampleDisplayRepository = new PrivateScriptExampleDisplayRepository();
export { ScriptExampleDisplayRepository };