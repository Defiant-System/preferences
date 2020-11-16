
// parts.displays

{
	dispatch(event) {
		let Self = parts.displays,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
