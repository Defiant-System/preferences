
// parts.screenSaver

{
	dispatch(event) {
		let Self = parts.screenSaver,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
