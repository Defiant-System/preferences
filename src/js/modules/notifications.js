
// Section.notifications

{
	dispatch(event) {
		let Self = Section.notifications,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
