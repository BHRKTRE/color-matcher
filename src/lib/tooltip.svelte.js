// Shared tooltip state — shown above the controls panel in FullScreenDisplay.
// Any component can write to this; FullScreenDisplay reads it.
let text = $state('');

export const tooltip = {
	get value() {
		return text;
	},
	set(msg) {
		text = msg;
	},
	clear() {
		text = '';
	}
};
