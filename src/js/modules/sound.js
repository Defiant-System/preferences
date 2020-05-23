
// parts.sound

{
	dispatch(event) {
		let self = parts.sound,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
