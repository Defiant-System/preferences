
// Section.mouse

{
	dispatch(event) {
		let Self = Section.mouse,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
