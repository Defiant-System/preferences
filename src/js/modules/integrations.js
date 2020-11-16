
// parts.integrations

{
	dispatch(event) {
		let Self = parts.integrations,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
