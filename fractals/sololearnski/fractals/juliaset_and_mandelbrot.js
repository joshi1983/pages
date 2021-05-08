
/*
JulaSetAndMandelBrot is for exploring the mandelbrot and juliaset spaces together.

This covers all mandelbrot juliaset fractals and more.
Unlike Mandelbrot and Juliaset, this also visualizes patterns 
where 1 mandelbrot and 1 juliaset value are given by screen coordinates.

Juliaset calculations depend on 4 values.  These are:
- a mandelbrot x, y position.  This is kept constant for a juliaset drawing.
- a juliaset x, y position.  This is kept as 0, 0 when drawing the mandelbrot fractal.
*/
function JuliaSetAndMandelbrot() {
    var self = this;
    
    self.mandelBrotX = -0.704029749122184;
    self.mandelBrotY = -0.3383527246917294;
    self.juliasetX = 0;
    self.juliasetY = 0;
    self.xProperty = 'juliasetX';
    self.yProperty = 'mandelBrotY';
    self.name = '4D Julia Set/Mandelbrot';

    self.getInputs = function() {
        return [
            {'name': 'mandelBrotX', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.mandelBrotX},
            {'name': 'mandelBrotY', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.mandelBrotY},
            {'name': 'juliasetX', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.juliasetX},
            {'name': 'juliasetY', 'min': -2, 'max': 2, 'step': 0.01, 'value': self.juliasetY},
            {'name': 'xProperty', 'options': ['juliasetX', 'juliasetY', 'mandelBrotX', 'mandelBrotY'], 'value': 'juliasetX'},
            {'name': 'yProperty', 'options': ['juliasetX', 'juliasetY', 'mandelBrotX', 'mandelBrotY'], 'value': 'mandelBrotX'}
        ];
    };
    
    // Gets the specified property while respecting the overrides for x and y.
    // @param propertyName is the name of a property such as 'juliasetX' or 'mandelBrotX'.
    self.getWithOverride = function(propertyName, x, y) {
        if (self.xProperty === propertyName)
            return x; // use the x override because horizontal dimension on screen corresponds with specified property.
        else if (self.yProperty === propertyName)
            return y; // use the y override because vertical dimension on screen corresponds with specified property.
        else
            return self[propertyName]; // get from the dialog's slider values.
    };

    self.getValueAt = function(x, y) {
        var n = 255;

        var cRe = self.getWithOverride('mandelBrotX', x, y);
        var cIm = self.getWithOverride('mandelBrotY', x, y);
        var newRe = self.getWithOverride('juliasetX', x, y);
        var newIm = self.getWithOverride('juliasetY', x, y);

        for(var i = 0; i < 255; i++)
        {
          //remember value of previous iteration
          var oldRe = newRe;
          var oldIm = newIm;
          //the actual iteration, the real and imaginary part are calculated
          newRe = oldRe * oldRe - oldIm * oldIm + cRe;
          newIm = 2 * oldRe * oldIm + cIm;
          //if the point is outside the circle with radius 2: stop
          if((newRe * newRe + newIm * newIm) > 4) break;
        }
    
        return i;
    };
}
