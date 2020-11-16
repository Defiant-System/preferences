
// parts.general

{
	dispatch(event) {
		let Self = parts.general,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
