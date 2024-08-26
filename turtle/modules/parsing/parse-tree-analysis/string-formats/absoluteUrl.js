const supportedProtocolsArray = ['data', 'http', 'https'];
const supportedProtocols = new Set(supportedProtocolsArray);

function hasProtocol(s) {
	const index = s.indexOf(':');
	return index !== -1 && index < 15;
}

export function getProtocol(s) {
	const index = s.indexOf(':');
	if (index !== -1)
		return s.substring(0, index).toLowerCase();
};

export function absoluteUrl(s, extendedChecks) {
	if (!hasProtocol(s))
		return 'missing protocol.  A protocol must be specified at the beginning such as https://';
	if (!s.toLowerCase().startsWith('data') && (s.indexOf('://') === -1 || s.indexOf('://') > 5))
		return ':// must be immediately after protocol unless you specify a data url';
	const protocol = getProtocol(s);
	if (!supportedProtocols.has(protocol))
		return `Unsupported protocol "${protocol}".  The protocol must be one of ${supportedProtocolsArray.join(',')}`;
	if (protocol.startsWith('http') && s.indexOf('.') === -1)
		return 'host name missing.  An IP address, domain name, or any other host name must be specified such as github.com';
}