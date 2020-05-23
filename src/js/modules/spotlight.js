
// parts.spotlight

{
	dispatch(event) {
		let self = parts.spotlight,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
