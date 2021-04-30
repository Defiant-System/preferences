
// Section.accessibility

{
	dispatch(event) {
		let Self = Section.accessibility,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
