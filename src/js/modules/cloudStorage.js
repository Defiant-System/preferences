
// parts.cloudStorage

{
	dispatch(event) {
		let self = parts.cloudStorage,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
		}
	}
}
