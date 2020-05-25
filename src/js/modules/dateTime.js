
// parts.dateTime

{
	dispatch(event) {
		let self = parts.dateTime,
			isLocked,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				self.dateSettings = self.section.find(".date-settings .wrapper");
				self.timeSettings = self.section.find(".time-settings .wrapper");
				self.incArrows = self.section.find(".date-time-options .inc-arrows_");
				self.calendar = self.section.find(".calendar");
				self.clock = self.section.find(".clock");
				self.worldmap = self.section.find(".worldmap");
				self.lock = self.section.find(".row-foot .unlock-to-edit");
				self.clockOptions = self.section.find(".clock-options");

				// toggle view; if user already unlocked previously
				self.dispatch({
					type: "toggle-view",
					isUnlocked: preferences.views.isUnlocked
				});
				
				// temp
				//self.section.find(".tab-row_ > div:nth-child(3)").trigger("click");
				break;
			case "window.keyup":
				if (window.dialog._name === "unlock") {
					self.dispatch({ type: "dialog-unlock-check" });
				}
				break;
			case "go-to-language":
				preferences.dispatch({ type: "go-to", view: "language" });
				break;
			case "increment-date":
			case "increment-time":
				console.log(event);
				break;
			case "select-time-zone":
				el = $(event.target);
				if (self.worldmap.hasClass("disabled_")) return;

				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				self.section.find(".timezone-name").html( el.data("name") +" Time" );
				self.section.find(".timezone-utc").html( el.data("utc") );
				break;

			case "dialog-unlock-check":
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
					return self.dispatch({ type: "toggle-view", isUnlocked: true });
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
					preferences.views = {};
				}

				// lock icon UI
				self.lock.removeClass("authorizing")
					.toggleClass("unlocked", !event.isUnlocked);

				self.dateSettings.toggleClass("disabled_", event.isUnlocked);
				self.timeSettings.toggleClass("disabled_", event.isUnlocked);
				self.incArrows.toggleClass("disabled_", event.isUnlocked);
				self.calendar.toggleClass("disabled_", event.isUnlocked);
				self.clock.toggleClass("disabled_", event.isUnlocked);
				self.worldmap.toggleClass("disabled_", event.isUnlocked);

				// clock options
				items = self.clockOptions.find("input, selectbox");
				items.toggleAttr("disabled", event.isUnlocked);
				items.parent().toggleClass("disabled_", event.isUnlocked);
				break;
		}
	}
}
