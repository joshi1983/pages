import { downloadDataUrl } from
'../../modules/components/downloadDataUrl.js';
import { ready } from '../../modules/ready.js';
// some of the code here was adapted from:
// https://stuk.github.io/jszip/documentation/examples/download-zip-file.html

//**blob to dataURL**
// this is copied from: https://gist.github.com/antony/ed2de2ec5b95bb0be28cd261b0201144
function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {callback(e.target.result);}
    a.readAsDataURL(blob);
}

function download() {
	const zip = new JSZip();
	zip.file("Hello.txt", "Hello world\n");
	zip.generateAsync({type:"blob"}).then(function (blob) {
		// 1) generate the zip file
		blobToDataURL(blob, function(dataUrl) {
			downloadDataUrl("hello.zip", dataUrl);
		});
    }, function (err) {
        console.error(err);
    });
}

function init() {
	const button = document.getElementById('downloadZip');
	button.addEventListener('click', download);
}

ready(init);