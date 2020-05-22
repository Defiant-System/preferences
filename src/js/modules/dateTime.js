
// parts.dateTime

{
	dispatch(event) {
		let self = parts.dateTime,
			section = event.section,
			isLocked,
			el;
		switch (event.type) {
			case "init-view":
				break;
			case "go-to-language":
				preferences.dispatch({ type: "go-to", view: "language" });
				break;
			case "unlock-view":
				isLocked = event.el.hasClass("unlocked");
				event.el.toggleClass("unlocked", isLocked);
				break;
		}
	}
}
