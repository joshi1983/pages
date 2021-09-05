import fs from 'fs';
export function readFile(filename) {
	return new Promise(function(resolve, reject) {
		fs.readFile(filename, "utf8", async function(err, data) {
			if (err)
				reject(err);
			else
				resolve(data);
		});
	});
}