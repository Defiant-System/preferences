
// parts.notifications

{
	dispatch(event) {
		let Self = parts.notifications,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
