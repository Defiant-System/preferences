
// Section.displays

{
	dispatch(event) {
		let Self = Section.displays,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
