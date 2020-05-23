
// parts.keyboard

{
	dispatch(event) {
		let self = parts.keyboard,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
