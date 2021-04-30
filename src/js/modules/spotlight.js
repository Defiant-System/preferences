
// Section.spotlight

{
	dispatch(event) {
		let Self = Section.spotlight,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
