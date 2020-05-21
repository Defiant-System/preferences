
// parts.userGroups

{
	dispatch(event) {
		let self = parts.userGroups,
			section = event.section,
			el;
		switch (event.type) {
			case "init-view":
				break;
			case "unlock-view":
				event.el.toggleClass("unlocked", event.el.hasClass("unlocked"));
				break;
		}
	}
}
