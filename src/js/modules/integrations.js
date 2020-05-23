
// parts.integrations

{
	dispatch(event) {
		let self = parts.integrations,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
