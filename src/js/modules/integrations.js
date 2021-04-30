
// Section.integrations

{
	dispatch(event) {
		let Self = Section.integrations,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
