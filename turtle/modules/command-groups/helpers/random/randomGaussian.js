/*
Copied and adapted from:
https://codemia.io/knowledge-hub/path/javascript_mathrandom_normal_distribution_gaussian_bell_curve
*/
export function randomGaussian(prGenerator) {
    const u1 = prGenerator.randomRatio();
    const u2 = prGenerator.randomRatio();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    return z0; // This is a standard normal distribution with mean 0 and standard deviation 1
};