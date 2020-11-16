
// parts.sharing

{
	dispatch(event) {
		let Self = parts.sharing,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				break;
		}
	}
}
