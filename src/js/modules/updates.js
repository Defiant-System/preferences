
// parts.updates

{
	dispatch(event) {
		let Self = parts.updates,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
