
// Section.sharing

{
	dispatch(event) {
		let Self = Section.sharing,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
