
// parts.displays

{
	dispatch(event) {
		let self = parts.displays,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
