
// Section.updates

{
	dispatch(event) {
		let Self = Section.updates,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
