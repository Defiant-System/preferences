
// parts.dateTime

{
	async dispatch(event) {
		let Self = parts.dateTime,
			isLocked,
			now,
			shell,
			items,
			value,
			target,
			el;
		switch (event.type) {
			case "init-view":
				// fast references
				Self.section = event.section;
				Self.timeOptions = Self.section.find(".date-time-options");
				Self.calendar = Self.timeOptions.find(".calendar");
				Self.clockSvg = Self.timeOptions.find(".clock svg");
				Self.worldmap = Self.timeOptions.find(".worldmap");
				Self.timeOptionSeconds = Self.timeOptions.find(".seconds");
				Self.lock = Self.section.find(".row-foot .unlock-to-edit");

				// set date time; calendar and clock
				// Self.dateTime = new defiant.Moment();
				Self.updateTimeOptions();

				// show / hide menubar-date-time
				shell = await defiant.shell(`sys -l`);
				Self.section.find(`input[id="show-date-time"]`).prop({ checked: shell.result });

				// parse format
				shell = await defiant.shell(`sys -q`);
				Self.parseFormat(shell.result);

				// digital / analogue
				shell = await defiant.shell(`sys -m`);
				Self.section.find(`input[id="time-option-${shell.result}"]`).prop({ checked: true });

				if (shell.result !== "digital") {
					setTimeout(() => {
						Self.section.find("input#use-24-hour").attr({ disabled: "disabled" })
							.parents(".row-group_").addClass("disabled_");
						Self.section.find("input#show-am-pm").attr({ disabled: "disabled" })
							.parents(".row-group_").addClass("disabled_");
					});
				}

				// toggle view; if user already unlocked previously
				Self.dispatch({
					type: "toggle-view",
					isUnlocked: true //preferences.views.isUnlocked
				});

				Self.renderCalendar();
				
				// temp
				// Self.section.find(".tab-row_ > div:nth-child(3)").trigger("click");
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

				Self.section.find(".date-settings .wrapper").toggleClass("disabled_", event.isUnlocked);
				Self.section.find(".time-settings .wrapper").toggleClass("disabled_", event.isUnlocked);
				Self.timeOptions.find(".inc-arrows_").toggleClass("disabled_", event.isUnlocked);
				Self.timeOptions.find(".clock").toggleClass("disabled_", event.isUnlocked);
				Self.calendar.toggleClass("disabled_", event.isUnlocked);
				Self.worldmap.toggleClass("disabled_", event.isUnlocked);

				// clock options
				items = Self.section.find(".clock-options").find("input, selectbox");
				items.toggleAttr("disabled", event.isUnlocked);
				items.parents(".row-group_").toggleClass("disabled_", event.isUnlocked);

				if (Self.section.find(`input[id="time-option-analogue"]`).is(":checked")) {
					Self.section.find("input#use-24-hour").attr({ disabled: "disabled" })
						.parents(".row-group_").addClass("disabled_");
					Self.section.find("input#show-am-pm").attr({ disabled: "disabled" })
						.parents(".row-group_").addClass("disabled_");
				}
				break;
			case "toggle-menubar-clock":
				el = $(event.target);
				if (el.attr("type") !== "radio") return;
				value = el.attr("id").split("-")[2];

				if (value === "digital") {
					Self.section.find("input#use-24-hour").removeAttr("disabled")
						.parents(".row-group_").removeClass("disabled_");
					Self.section.find("input#show-am-pm").removeAttr("disabled")
						.parents(".row-group_").removeClass("disabled_");
				} else {
					Self.section.find("input#use-24-hour").attr({ disabled: "disabled" })
						.parents(".row-group_").addClass("disabled_");
					Self.section.find("input#show-am-pm").attr({ disabled: "disabled" })
						.parents(".row-group_").addClass("disabled_");
				}
				// save value to settings
				defiant.shell(`sys -m ${value}`);
				break;
			case "toggle-menubar-date-time":
				el = $(event.target);
				if (el.attr("type") !== "checkbox") return;
				value = el.is(":checked");

				switch (el.attr("id")) {
					case "show-date-time":
						defiant.shell(`sys -l ${value}`);
						break;
					case "show-weekday":
					case "show-date":
					case "show-time":
						value = Self.buildFormat();
						break;
					case "use-24-hour":
						Self.section.find("input#use-24-hour").prop({ checked: true });
						Self.section.find("input#show-am-pm").prop({ checked: false });
						value = Self.buildFormat();
						break;
					case "show-am-pm":
						Self.section.find("input#use-24-hour").prop({ checked: false });
						Self.section.find("input#show-am-pm").prop({ checked: true });
						value = Self.buildFormat();
						break;
				}
				// save value to settings
				defiant.shell(`sys -q "${value}"`);
				break;
		}
	},
	updateTimeOptions() {
		// clear timer; just in case...and avoid multiple calls
		clearTimeout(this.timer);

		let Self = this,
			now = new defiant.Moment();
		Self.timeOptions.find(".year").html(now.format("YYYY"));
		Self.timeOptions.find(".month").html(now.format("HH"));
		Self.timeOptions.find(".date").html(now.format("DD"));
		Self.timeOptions.find(".hours").html(now.format("HH"));
		Self.timeOptions.find(".minutes").html(now.format("mm"));
		Self.timeOptionSeconds.html(now.format("ss"));

		let hours = 30 * (now.date.getHours() % 12) + now.date.getMinutes() / 2,
			minutes = 6 * now.date.getMinutes(),
			seconds = 6 * now.date.getSeconds();
		Self.clockSvg.css({
			"--rotation-hours": `${hours}deg`,
			"--rotation-minutes": `${minutes}deg`,
			"--rotation-seconds": `${seconds}deg`,
		});

		let nextTick = 1000 - now.date.getMilliseconds();
		Self.timer = setTimeout(Self.updateTimeOptions.bind(Self), nextTick);
	},
	buildFormat() {
		let Self = this,
			result = [];

		if (Self.section.find("input#show-weekday").is(":checked")) result.push("ddd");
		if (Self.section.find("input#show-date").is(":checked")) result.push("DD MMM");
		if (Self.section.find("input#show-time").is(":checked")) {
			if (Self.section.find("input#use-24-hour").is(":checked")) result.push("HH:mm");
			else if (Self.section.find("input#show-am-pm").is(":checked")) result.push("H:mm a");
		}

		return result.join(" ");
	},
	parseFormat(format) {
		let Self = this,
			off = { checked: false },
			on = { checked: true };
		// reset all fields
		Self.section.find("input#show-weekday").prop(off);
		Self.section.find("input#show-date").prop(off);
		Self.section.find("input#show-time").prop(off);
		Self.section.find("input#use-24-hour").prop(off);
		Self.section.find("input#show-am-pm").prop(off);
		// iterate values
		format.split(" ").map(str => {
			switch (str) {
				case "ddd":
					Self.section.find("input#show-weekday").prop(on);
					break;
				case "dd":
				case "MMM":
					Self.section.find("input#show-date").prop(on);
					break;
				case "HH:mm":
					Self.section.find("input#show-time").prop(on);
					Self.section.find("input#use-24-hour").prop(on);
					break;
				case "H:mm":
				case "a":
					Self.section.find("input#show-time").prop(on);
					Self.section.find("input#show-am-pm").prop(on);
					break;
			}
		});
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
