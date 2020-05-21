
// parts.usersGroups

{
	dispatch(event) {
		let self = parts.usersGroups,
			section = event.section,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				self.tabView = self.section.find(".tab-active_");
				console.log(self.tabView);
				break;
			case "select-user":
				el = $(event.target);
				if (el.hasClass("active") || el.hasClass("panel-left")) return;

				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				value = el.hasClass("login-options") ? "show-login-options" : "show-user-options";
				self.tabView
					.removeClass("show-user-options show-login-options")
					.addClass(value);
				break;
			case "auto-login-option":
				console.log(event);
				break;
			case "unlock-view":
				event.el.toggleClass("unlocked", event.el.hasClass("unlocked"));
				break;
		}
	}
}
