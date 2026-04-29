export const isMobile =
	typeof navigator !== 'undefined' &&
	/mobile|android|iphone|ipad|tablet/i.test(navigator.userAgent);
