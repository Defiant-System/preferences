
// parts.keyboard

{
	dispatch(event) {
		let Self = parts.keyboard,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
