
// parts.security

{
	dispatch(event) {
		let self = parts.security,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
