
// parts.accessibility

{
	dispatch(event) {
		let Self = parts.accessibility,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
