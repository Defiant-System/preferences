
// parts.updates

{
	dispatch(event) {
		let self = parts.updates,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
