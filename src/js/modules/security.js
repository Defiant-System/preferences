
// parts.security

{
	dispatch(event) {
		let Self = parts.security,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
