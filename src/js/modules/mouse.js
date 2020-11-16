
// parts.mouse

{
	dispatch(event) {
		let Self = parts.mouse,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
