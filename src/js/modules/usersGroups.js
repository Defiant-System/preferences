
// parts.usersGroups

{
	dispatch(event) {
		let self = parts.usersGroups,
			section = event.section,
			items,
			value,
			isLocked,
			el;
		//console.log(event);
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				self.tabView = self.section.find(".tab-active_");
				self.userOptions = self.tabView.find(".user-options");
				self.loginOptions = self.tabView.find(".login-options");
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
			case "edit-user-photo":
				console.log(event);
				break;
			case "auto-login-option":
				console.log(event);
				break;
			case "unlock-view":
				isLocked = event.el.hasClass("unlocked");
				event.el.toggleClass("unlocked", isLocked);

				// user options
				self.userOptions.find(".avatar").toggleClass("disabled_", !isLocked);
				self.userOptions.find("button").toggleAttr("disabled", !isLocked);

				// login options
				items = self.loginOptions.find("input, selectbox");
				items.toggleAttr("disabled", !isLocked);
				items.parent().toggleClass("disabled_", !isLocked);
				break;
		}
	}
}
