
// parts.sharing

{
	dispatch(event) {
		let self = parts.sharing,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
