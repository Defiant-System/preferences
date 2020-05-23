
// parts.general

{
	dispatch(event) {
		let self = parts.general,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
