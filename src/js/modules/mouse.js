
// parts.mouse

{
	dispatch(event) {
		let self = parts.mouse,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
