
// Section.keyboard

{
	dispatch(event) {
		let Self = Section.keyboard,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
