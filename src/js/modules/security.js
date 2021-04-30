
// Section.security

{
	dispatch(event) {
		let Self = Section.security,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
