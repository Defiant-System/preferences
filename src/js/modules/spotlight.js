
// parts.spotlight

{
	dispatch(event) {
		let Self = parts.spotlight,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
