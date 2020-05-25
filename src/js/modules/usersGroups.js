
// parts.usersGroups

{
	dispatch(event) {
		let self = parts.usersGroups,
			items,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				self.tabView = self.section.find(".tab-active_");
				self.userOptions = self.tabView.find(".user-options");
				self.loginOptions = self.tabView.find(".login-options");
				self.lock = self.section.find(".row-foot .unlock-to-edit");

				// toggle view; if user already unlocked previously
				self.dispatch({
					type: "toggle-view",
					isUnlocked: preferences.views && preferences.views.isUnlocked
				});
				break;
			case "window.keyup":
				if (window.dialog._name === "unlock") {
					self.dispatch({ type: "check-unlock-password" });
				}
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

			case "remember-me":
				value = event.target.checked;
				if (value) {
					// add encrypted password cookie
				} else {
					// remove encrypted password cookie
					//$.cipher(event.data.password, defiant.salt)
				}
				break;
			case "option-create":
			case "option-other-login":
			case "show-full-name":
				break;
			case "edit-user-photo":
				console.log(event);
				break;
			case "auto-login-option":
				console.log(event);
				break;

			case "dialog-unlock-check":
			case "check-unlock-password":
				value = window.dialog.find("input").val();
				items = $.cookie.get("defiantUser").split("%");
				if (items[0] !== value.sha1()) {
					// incorrect password
					return window.dialog.shake();
				} else {
					self.dispatch({
						type: "toggle-view",
						isUnlocked: true,
						password: value
					});
				}
				/* falls through */
			case "dialog-unlock-cancel":
				// lock icon UI
				self.lock.removeClass("authorizing");
				// close unlock dialog
				window.dialog.close();
				break;
			case "toggle-view-lock":
				if (event.el.hasClass("unlocked")) {
					event.el.removeClass("unlocked");
					self.dispatch({ type: "toggle-view" });
				} else {
					// lock icon UI
					self.lock.addClass("authorizing");
					// show unlock dialog
					window.dialog.open({ name: "unlock" });
				}
				break;
			case "toggle-view":
				if (event.isUnlocked) {
					// save info to root app
					preferences.views = (({ isUnlocked, password }) => ({ isUnlocked, password }))(event);
				} else {
					// lock: forget references to views
					delete preferences.views;
				}

				// lock icon UI
				self.lock.removeClass("authorizing")
					.toggleClass("unlocked", !event.isUnlocked);

				// user options
				self.userOptions.find(".avatar").toggleClass("disabled_", event.isUnlocked);
				self.userOptions.find("button").toggleAttr("disabled", event.isUnlocked);

				// login options
				items = self.loginOptions.find("input, selectbox");
				items.toggleAttr("disabled", event.isUnlocked);
				items.parent().toggleClass("disabled_", event.isUnlocked);
				break;
		}
	}
}
