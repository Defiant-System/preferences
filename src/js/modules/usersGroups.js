
// parts.userGroups

{
	dispatch(event) {
		let self = parts.userGroups,
			section = event.section,
			el;
		//console.log(event);
		switch (event.type) {
			case "init-view":
				break;
			case "select-user":
				el = $(event.target);
				if (el.hasClass("active") || el.hasClass("panel-left")) return;

				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				break;
			case "unlock-view":
				event.el.toggleClass("unlocked", event.el.hasClass("unlocked"));
				break;
		}
	}
}
