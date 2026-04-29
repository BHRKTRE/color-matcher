// Color space definitions — wavelength is its own route (/wavelength)
export const colorSpaces = {
	hsl: {
		name: 'HSL',
		channels: ['H', 'S', 'L'],
		keys: ['h', 's', 'l'],
		min: [0, 0, 0],
		max: [360, 100, 100]
	},
	rgb: {
		name: 'RGB',
		channels: ['R', 'G', 'B'],
		keys: ['r', 'g', 'b'],
		min: [0, 0, 0],
		max: [255, 255, 255]
	},
	cmyk: {
		name: 'CMYK',
		channels: ['C', 'M', 'Y', 'K'],
		keys: ['c', 'm', 'y', 'k'],
		min: [0, 0, 0, 0],
		max: [100, 100, 100, 100]
	},
	hsv: {
		name: 'HSV',
		channels: ['H', 'S', 'V'],
		keys: ['h', 's', 'v'],
		min: [0, 0, 0],
		max: [360, 100, 100]
	}
};
