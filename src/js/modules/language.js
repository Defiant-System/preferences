
// parts.language

{
	dispatch(event) {
		let self = parts.language,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
