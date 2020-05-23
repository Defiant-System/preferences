
// parts.accessibility

{
	dispatch(event) {
		let self = parts.accessibility,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
