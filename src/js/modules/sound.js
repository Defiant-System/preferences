
// parts.sound

{
	dispatch(event) {
		let Self = parts.sound,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
