
// Section.dateTime

{
	async dispatch(event) {
		let Self = Section.dateTime,
			isLocked,
			date,
			diff,
			newMonth,
			shell,
			items,
			value,
			add,
			str,
			target,
			el;
		switch (event.type) {
			case "init-view":
				// fast references
				Self.doc = $(document);
				Self.section = event.section;
				Self.diffOptions = Self.section.find(".date-diff-options");
				Self.timeOptions = Self.section.find(".date-time-options");
				Self.calendar = Self.timeOptions.find(".calendar .reel");
				Self.clockSvg = Self.timeOptions.find(".clock svg");
				Self.worldmap = Self.section.find("div.worldmap-land");
				Self.lock = Self.section.find(".row-foot .unlock-to-edit");

				// start update; calendar and clock
				setTimeout(Self.updateTimeOptions.bind(Self), 60);

				// dateTime difference
				shell = await defiant.shell(`sys -y`);
				if (shell.result !== 0) {
					Self.section.find("input#set-automatically").prop({ checked: false });
				}

				// clock 24h (or am/pm)
				shell = await defiant.shell(`sys -u`);
				Self.clockSvg.parent().toggleClass("show-24h", shell.result === "am/pm");

				// timezone
				shell = await defiant.shell(`sys -z`);
				Self.worldmap.find(`.utc-bar[data-utc="${shell.result}"]`).addClass("active");

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

				// initial month render
				Self.calendar.html("");
				Self.calendarDate = new defiant.Moment();
				Self.renderCalendar();

				// bind event handlers
				Self.clockSvg.on("mousedown", Self.clockHands);

				// temp
				// setTimeout(() => { Self.updateTimeOptions(1619947845000) }, 200);

				Self.section.find("input#set-automatically").trigger("click");
				// Self.section.find(".tab-row_ > div:nth-child(3)").trigger("click");
				break;
			case "dispose-view":
				// unbind event handlers
				Self.clockSvg.off("mousedown", Self.clockHands);
				break;
			case "window.keystroke":
				if (window.dialog._name === "unlock") {
					Self.dispatch({ type: "dialog-unlock-check" });
				}
				break;
			case "go-to-language":
				preferences.dispatch({ type: "go-to", view: "language" });
				break;
			case "select-date-section":
				target = $(event.target);
				if (target.hasClass("seperator")) return;

				// make wrapper active
				Self.timeOptions.find(".selected").removeClass("selected");
				Self.timeOptions.find(".active").removeClass("active");
				event.el.addClass("active");

				target.addClass("selected");
				break;
			case "datetime-revert-diff":
				Self.section.find("input#set-automatically").trigger("click");
				break;
			case "datetime-apply-diff":
				// build date from fields
				str = Self.timeOptions.find(".year").text() +"-";
				str += Self.timeOptions.find(".month").text() +"-";
				str += Self.timeOptions.find(".date").text() +" ";
				str += Self.timeOptions.find(".hours").text() +":";
				str += Self.timeOptions.find(".minutes").text() +":";
				str += Self.timeOptions.find(".seconds").text();
				
				if (!event.viewOnly) {
					date = new Date(str);
					diff = date.valueOf() - Date.now();
					defiant.shell(`sys -y ${diff}`);
					// allow clock to tick
					Self.timeOptions.find(".wrapper.active").removeClass("active");
					Self.timeOptions.find(".selected").removeClass("selected");
				}
				// start ticking
				Self.updateTimeOptions(str);
				break;
			case "select-date-day":
				if (Self.section.find("input#set-automatically").is(":checked")) return;

				el = $(event.target);
				let mEl = el.parents(".calendar-month"),
					[year, month] = mEl.data("year-month").split("-");

				// remove "today", if any
				mEl.find(".today").removeClass("today");

				el.addClass("today"); // new "today"
				date = el.text();

				Self.timeOptions.find(".year").html(year);
				Self.timeOptions.find(".month").html(month);
				Self.timeOptions.find(".date").html(date);
				break;
			case "increment-date":
			case "increment-time":
				el = Self.timeOptions.find(".selected");
				target = $(event.target);
				add = +target.data("add");
				value = +el.html();

				switch (true) {
					case el.hasClass("year"):
						value = value + add;
						break;
					case el.hasClass("month"):
						value = Math.max(Math.min(value + add, 12), 1).toString().padStart(2, "0");
						break;
					case el.hasClass("date"):
						let year = +Self.timeOptions.find(".year").html();
						let month = +Self.timeOptions.find(".month").html();
						let max = (new Date(year, month, 0)).getDate();
						value = Math.max(Math.min(value + add, max), 1).toString().padStart(2, "0");
						break;
					case el.hasClass("hours"):
						value = Math.max(Math.min(value + add, 23), 0).toString().padStart(2, "0");
						break;
					case el.hasClass("minutes"):
					case el.hasClass("seconds"):
						value = Math.max(Math.min(value + add, 59), 0).toString().padStart(2, "0");
						break;
				}

				el.html(value);
				// ui update
				Self.dispatch({ type: "datetime-apply-diff", viewOnly: true });
				break;
			case "go-prev-month":
				date = Self.calendarDate.date;
				date.setMonth(date.getMonth() - 1);
				// render month
				newMonth = Self.renderCalendar();
				newMonth.css({ left: `-${Self.calendar.parent().width()}px` });

				Self.calendar.cssSequence("to-left", "transitionend", el => {
					newMonth.prev(".calendar-month").remove();
					newMonth.css({ left: "" });
					el.removeClass("to-left");
				});
				break;
			case "go-next-month":
				date = Self.calendarDate.date;
				date.setMonth(date.getMonth() + 1);
				// render month
				newMonth = Self.renderCalendar();
				newMonth.css({ left: `${Self.calendar.parent().width()}px` });

				Self.calendar.cssSequence("to-right", "transitionend", el => {
					newMonth.prev(".calendar-month").remove();
					newMonth.css({ left: "" });
					el.removeClass("to-right");
				});
				break;
			case "select-time-zone":
				el = $(event.target);
				if (Self.worldmap.hasClass("disabled_") || !el.data("utc")) return;

				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				Self.section.find(".timezone-name").html( el.data("name") +" Time" );
				Self.section.find(".timezone-utc").html( el.data("utc") );

				// save to setting
				defiant.shell(`sys -z "${el.data("utc")}"`);
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

				Self.timeOptions.find(".row-group_").toggleClass("disabled_", event.isUnlocked);
				Self.worldmap.toggleClass("disabled_", event.isUnlocked);

				// clock options
				items = Self.section.find(".clock-options").find("input, selectbox");
				items.toggleAttr("disabled", event.isUnlocked);
				items.parents(".row-group_").toggleClass("disabled_", event.isUnlocked);
				Self.timeOptions.find(".row-group_ input").toggleAttr("disabled", event.isUnlocked);

				if (Self.section.find(`input[id="time-option-analogue"]`).is(":checked")) {
					Self.section.find("input#use-24-hour").attr({ disabled: "disabled" })
						.parents(".row-group_").addClass("disabled_");
					Self.section.find("input#show-am-pm").attr({ disabled: "disabled" })
						.parents(".row-group_").addClass("disabled_");
				}
				// force in to boolean value
				Self.viewLocked = !!event.isUnlocked;

				target = Self.section.find("input#set-automatically")[0];
				Self.dispatch({ type: "toggle-manual-date-time", target });
				break;
			case "toggle-manual-date-time":
				el = $(event.target);
				if (el.attr("type") !== "checkbox") return;
				value = el.is(":checked");

				// view lock logic
				value = !Self.viewLocked || value;

				Self.section.find(".date-diff-options").toggleClass("hidden", !value);
				Self.section.find(".date-settings .wrapper").toggleClass("disabled_", !value);
				Self.section.find(".time-settings .wrapper").toggleClass("disabled_", !value);
				Self.timeOptions.find(".inc-arrows_").toggleClass("disabled_", !value);
				Self.timeOptions.find(".clock").toggleClass("disabled_", !value);
				Self.calendar.parent().toggleClass("disabled_", !value);

				// allow clock to tick, if set automatically is checked
				Self.timeOptions.find(".wrapper.active").removeClass("active");
				Self.timeOptions.find(".selected").removeClass("selected");

				if (el.is(":checked")) {
					if (Self.viewLocked) {
						// reset settings
						defiant.shell(`sys -y ${0}`);
					}
					// start ticking
					Self.updateTimeOptions();
				} else {
					// auto focus on "year"
					Self.timeOptions.find(".year").trigger("click");
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
						// set i18n hours
						defiant.shell(`sys -u "24h"`);
						// ui update for clock
						Self.clockSvg.parent().addClass("show-24h");
						break;
					case "show-am-pm":
						Self.section.find("input#use-24-hour").prop({ checked: false });
						Self.section.find("input#show-am-pm").prop({ checked: true });
						value = Self.buildFormat();
						// set i18n hours
						defiant.shell(`sys -u "am/pm"`);
						// ui update for clock
						Self.clockSvg.parent().removeClass("show-24h");
						break;
				}
				// save value to settings
				defiant.shell(`sys -q "${value}"`);
				break;
		}
	},
	updateTimeOptions(date) {
		// clear timer; just in case...and avoid multiple calls
		clearTimeout(this.timer);

		let Self = this,
			now = new defiant.Moment(date),
			el;
		
		Self.timeOptions.find(".year").html(now.format("YYYY"));
		Self.timeOptions.find(".month").html(now.format("MM"));
		Self.timeOptions.find(".date").html(now.format("DD"));
		Self.timeOptions.find(".hours").html(now.format("HH"));
		Self.timeOptions.find(".minutes").html(now.format("mm"));
		Self.timeOptions.find(".seconds").html(now.format("ss"));

		let hours = 30 * (now.date.getHours() % 12) + now.date.getMinutes() / 2,
			minutes = 6 * now.date.getMinutes(),
			seconds = 6 * now.date.getSeconds();
		Self.clockSvg.css({
			"--rotation-hours": `${hours}deg`,
			"--rotation-minutes": `${minutes}deg`,
			"--rotation-seconds": `${seconds}deg`,
		});

		if (!Self.timeOptions.find(".wrapper.active").length) {
			let nextTick = 1e3 - now.date.getMilliseconds();
			Self.timer = setTimeout(Self.updateTimeOptions.bind(Self), nextTick);
		}
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
		let date = this.calendarDate,
			meta = date.render({ date, weekNumbers: 1, mini: 1 }),
			htm = [];

		// title: month
		htm.push(`<div class="calendar-month" data-year-month="${date.format("YYYY-MM")}">`);
		htm.push(`<div class="calendar-head">`);
		htm.push(`<span class="calendar-left" data-click="go-prev-month"></span>`);
		htm.push(`<span class="calendar-year-month">${date.format("MMMM YYYY")}</span>`);
		htm.push(`<span class="calendar-right" data-click="go-next-month"></span>`);
		htm.push(`</div>`);
		
		// loop weekdays
		htm.push(`<div class="weekdays">`);
		meta.weekdays.map(day => {
			let className = day.type ? ` class="${day.type.join(" ")}"` : "";
			htm.push(`<b${className}>${day.name}</b>`);
		});
		htm.push(`</div>`);

		// loop days
		htm.push(`<div class="days" data-click="select-date-day">`);
		meta.days.map(day => {
			if (day.date) {
				let className = day.type ? ` class="${day.type.join(" ")}"` : "";
				htm.push(`<b${className}><i>${day.date}</i></b>`);
			}
		});
		htm.push(`</div></div></div>`);

		return this.calendar.append(htm.join(""));
	},
	clockHands(event) {
		let Self = Section.dateTime,
			Drag = Self.drag,
			css = {};
		switch (event.type) {
			case "mousedown":
				let el = $(event.target),
					pEl = el.parent();

				if (Self.section.find("input#set-automatically").is(":checked")
					|| (!el.hasClass("hours-handle")
					&& !el.hasClass("minutes-handle")
					&& !el.hasClass("seconds-handle"))) return;

				// collect info
				let mHand = Self.timeOptions.find(`.minutes`),
					sHand = Self.timeOptions.find(`.seconds`),
					hand = el.prop("className").baseVal.split("-")[0],
					fEl = Self.timeOptions.find(`.${hand}`),
					rect = event.target.parentNode.getBoundingClientRect(),
					snap,
					offset;

				switch (hand) {
					case "hours":
						snap = 30;
						offset = (+mHand.text() / 60) * snap;
						break;
					case "minutes":
						snap = 6;
						offset = (+sHand.text() / 60) * snap;
						break;
				}

				// prepare drag info
				Self.drag = {
					el,
					pEl,
					fEl,
					hand,
					snap,
					offset,
					cY: rect.top + (rect.height / 2),
					cX: rect.left + (rect.width / 2),
				};

				// bind event handler
				Self.doc.on("mousemove mouseup", Self.clockHands);
				break;
			case "mousemove":
				let dY = event.clientY - Drag.cY,
					dX = event.clientX - Drag.cX,
					theta = Math.atan2(dY, dX);
				theta *= (180 / Math.PI);
				theta = (theta + 450) % 360;
				
				// value of field
				let value = Drag.hand === "hours"
								? (theta / 360) * 11
								: (theta / 360) * 59;
				Drag.fEl.html(Math.round(value).toString().padStart(2, "0"));

				// apply snap, if any
				if (Drag.snap) {
					theta -= theta % Drag.snap;
					theta += Drag.offset;
				}
				// apply to element style
				css[`--rotation-${Drag.hand}`] = `${theta}deg`;
				Drag.pEl.css(css);
				break;
			case "mouseup":
				// unbind event handler
				Self.doc.off("mousemove mouseup", Self.clockHands);
				break;
		}
	}
}
