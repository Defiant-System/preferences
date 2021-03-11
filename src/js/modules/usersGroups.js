
// parts.usersGroups

{
	dispatch(event) {
		let Self = parts.usersGroups,
			items,
			value,
			el;
		//console.log(event);
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				Self.tabView = Self.section.find(".tab-active_");
				Self.userOptions = Self.tabView.find(".user-options");
				Self.loginOptions = Self.tabView.find(".login-options");
				Self.lock = Self.section.find(".row-foot .unlock-to-edit");

				// toggle view; if user already unlocked previously
				Self.dispatch({
					type: "toggle-view",
					isUnlocked: preferences.views.isUnlocked
				});

				// setTimeout(() => window.dialog.alert({
				// 	message: "Hello World",
				// 	onOk: () => console.log("OK")
				// }), 1000);

				// setTimeout(() => window.dialog.confirm({
				// 	message: "Hello World",
				// 	onCancel: () => console.log("Cancel"),
				// 	onOk: () => console.log("OK")
				// }), 1000);

				break;
			case "window.keystroke":
				if (event.char === "return") {
					Self.dispatch({ type: "dialog-unlock-check" });
				}
				if (event.char === "esc") {
					Self.dispatch({ type: "dialog-unlock-cancel" });
				}
				break;
			case "window.keydown":
				if (window.dialog._name === "unlock") {
					Self.dispatch({ type: "dialog-unlock-check" });
				}
				break;
			case "select-user":
				el = $(event.target);
				if (el.hasClass("active") || el.hasClass("panel-left")) return;

				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				value = el.hasClass("login-options") ? "show-login-options" : "show-user-options";
				Self.tabView
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
			case "auto-login-option":
				console.log(event);
				break;

			case "dialog-unlock-check":
				value = window.dialog.find("input").val();
				items = $.cookie.get("defiantUser").split("%");
				if (items[0] !== value.sha1()) {
					// incorrect password
					return window.dialog.shake();
				} else {
					Self.dispatch({
						type: "toggle-view",
						isUnlocked: true,
						password: value
					});
				}
				/* falls through */
			case "dialog-unlock-cancel":
				// lock icon UI
				Self.lock.removeClass("authorizing");
				// close unlock dialog
				window.dialog.close();
				break;

			case "dialog-profile-save":
			case "dialog-profile-cancel":
				// close unlock dialog
				window.dialog.close();
				break;
				
			case "toggle-view-lock":
				if (event.el.hasClass("unlocked")) {
					event.el.removeClass("unlocked");
					Self.dispatch({ type: "toggle-view" });
				} else {
					// lock icon UI
					Self.lock.addClass("authorizing");
					// show unlock dialog
					window.dialog.show({ name: "unlock" });
				}
				break;
			case "toggle-view":
				if (event.isUnlocked) {
					// save info to root app
					preferences.views = (({ isUnlocked, password }) => ({ isUnlocked, password }))(event);
				} else {
					// lock: forget references to views
					preferences.views = {};
				}

				// lock icon UI
				Self.lock.removeClass("authorizing")
					.toggleClass("unlocked", !event.isUnlocked);

				// user options
				// Self.userOptions.find(".avatar").toggleClass("disabled_", event.isUnlocked);
				Self.userOptions.find("button").toggleAttr("disabled", event.isUnlocked);

				// login options
				items = Self.loginOptions.find("input, selectbox");
				items.toggleAttr("disabled", event.isUnlocked);
				items.parent().toggleClass("disabled_", event.isUnlocked);
				break;
		}
	}
}
