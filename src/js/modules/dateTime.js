
// parts.dateTime

{
	dispatch(event) {
		let Self = parts.dateTime,
			isLocked,
			items,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;
				Self.dateSettings = Self.section.find(".date-settings .wrapper");
				Self.timeSettings = Self.section.find(".time-settings .wrapper");
				Self.incArrows = Self.section.find(".date-time-options .inc-arrows_");
				Self.calendar = Self.section.find(".calendar");
				Self.clock = Self.section.find(".clock");
				Self.worldmap = Self.section.find(".worldmap");
				Self.lock = Self.section.find(".row-foot .unlock-to-edit");
				Self.clockOptions = Self.section.find(".clock-options");

				// toggle view; if user already unlocked previously
				Self.dispatch({
					type: "toggle-view",
					isUnlocked: preferences.views.isUnlocked
				});

				Self.renderCalendar();
				
				// temp
				Self.section.find(".tab-row_ > div:nth-child(3)").trigger("click");
				break;
			case "window.keystroke":
				if (window.dialog._name === "unlock") {
					Self.dispatch({ type: "dialog-unlock-check" });
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
				if (Self.worldmap.hasClass("disabled_")) return;

				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				Self.section.find(".timezone-name").html( el.data("name") +" Time" );
				Self.section.find(".timezone-utc").html( el.data("utc") );
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
			case "toggle-view-lock":
				if (event.el.hasClass("unlocked")) {
					event.el.removeClass("unlocked");
					Self.dispatch({ type: "toggle-view" });
				} else {
					return Self.dispatch({ type: "toggle-view", isUnlocked: true });
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

				Self.dateSettings.toggleClass("disabled_", event.isUnlocked);
				Self.timeSettings.toggleClass("disabled_", event.isUnlocked);
				Self.incArrows.toggleClass("disabled_", event.isUnlocked);
				Self.calendar.toggleClass("disabled_", event.isUnlocked);
				Self.clock.toggleClass("disabled_", event.isUnlocked);
				Self.worldmap.toggleClass("disabled_", event.isUnlocked);

				// clock options
				items = Self.clockOptions.find("input, selectbox");
				items.toggleAttr("disabled", event.isUnlocked);
				items.parent().toggleClass("disabled_", event.isUnlocked);
				break;
		}
	},
	renderCalendar() {
		let date = new defiant.Moment(),
			meta = date.render({ date, weekNumbers: 1, mini: 1 }),
			htm = [];

		// title: month
		htm.push(`<div class="calendar-head">`);
		htm.push(`<span class="calendar-left"></span>`);
		htm.push(`<span class="calendar-month">${date.format("MMMM YYYY")}</span>`);
		htm.push(`<span class="calendar-right"></span>`);
		htm.push(`</div>`);
		
		// loop weekdays
		htm.push(`<div class="weekdays">`);
		meta.weekdays.map(day => {
			let className = day.type ? ` class="${day.type.join(" ")}"` : "";
			htm.push(`<b${className}>${day.name}</b>`);
		});
		htm.push(`</div>`);

		// loop days
		htm.push(`<div class="days">`);
		meta.days.map(day => {
			if (day.date) {
				let className = day.type ? ` class="${day.type.join(" ")}"` : "";
				htm.push(`<b${className}><i>${day.date}</i></b>`);
			}
		});
		htm.push(`</div></div>`);

		this.calendar.html(htm.join(""));
	}
}
