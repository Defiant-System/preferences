
// parts.notifications

{
	dispatch(event) {
		let self = parts.notifications,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
