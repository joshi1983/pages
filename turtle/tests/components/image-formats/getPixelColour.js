import { AlphaColour } from
'../../../modules/AlphaColour.js';

await AlphaColour.asyncInit();

export function getPixelColour(imageBitmap, x, y) {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match the ImageBitmap
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;

    // Draw the ImageBitmap onto the canvas
    context.drawImage(imageBitmap, 0, 0);

    // Get the pixel data at the specified coordinates
    const imageData = context.getImageData(x, y, 1, 1).data;

    // Extract RGBA values
    const [r, g, b, a] = imageData;

    return new AlphaColour(a, r, g, b);
};