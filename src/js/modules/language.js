
// Section.language

{
	dispatch(event) {
		let Self = Section.language,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
