
// Section.sound

{
	dispatch(event) {
		let Self = Section.sound,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
