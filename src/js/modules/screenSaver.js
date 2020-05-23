
// parts.screenSaver

{
	dispatch(event) {
		let self = parts.screenSaver,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
