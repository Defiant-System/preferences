
// parts.language

{
	dispatch(event) {
		let Self = parts.language,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
