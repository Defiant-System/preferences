
// parts.usersGroups

{
	dispatch(event) {
		let self = parts.usersGroups,
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
				self.lock = self.section.find(".row-foot .unlock-to-edit");
				break;
			case "window.keyup":
				value = event.target.value;

				items = $.cookie.get("defiantUser").split("%");
				if (items[0] !== value.sha1()) {
					// incorrect password
					window.dialog.shake();
				} else {
					// correct password - unlock view
					preferences.isUnlocked = true;
					
					self.dispatch({ type: "unlock-view", isUnlocked: true });

					window.dialog.close();
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
			case "dialog-unlock-cancel":
			case "dialog-unlock-unlock":
				self.lock.removeClass("authorizing");
				window.dialog.close();
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
			case "unlock-view":
				if (event.el && preferences.isUnlocked) {
					preferences.isUnlocked = false;
					isLocked = true;
					self.lock.removeClass("unlocked");
				} else if (!event.isUnlocked) {
					self.lock.addClass("authorizing");
					return window.dialog.open({ name: "unlock" });
				} else {
					isLocked = event.isUnlocked;
					self.lock.removeClass("authorizing").addClass("unlocked");
				}

				// user options
				self.userOptions.find(".avatar").toggleClass("disabled_", isLocked);
				self.userOptions.find("button").toggleAttr("disabled", isLocked);

				// login options
				items = self.loginOptions.find("input, selectbox");
				items.toggleAttr("disabled", isLocked);
				items.parent().toggleClass("disabled_", isLocked);
				break;
		}
	}
}
