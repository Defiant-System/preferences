
// Section.screenSaver

{
	dispatch(event) {
		let Self = Section.screenSaver,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
