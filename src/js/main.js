
const parts = {
	accessibility: ant_require("modules/accessibility.js"),
	dateTime:      ant_require("modules/dateTime.js"),
	desktop:       ant_require("modules/desktop.js"),
	displays:      ant_require("modules/displays.js"),
	dock:          ant_require("modules/dock.js"),
	general:       ant_require("modules/general.js"),
	integrations:  ant_require("modules/integrations.js"),
	keyboard:      ant_require("modules/keyboard.js"),
	language:      ant_require("modules/language.js"),
	mouse:         ant_require("modules/mouse.js"),
	notifications: ant_require("modules/notifications.js"),
	screenSaver:   ant_require("modules/screenSaver.js"),
	security:      ant_require("modules/security.js"),
	sharing:       ant_require("modules/sharing.js"),
	sound:         ant_require("modules/sound.js"),
	spotlight:     ant_require("modules/spotlight.js"),
	updates:       ant_require("modules/updates.js"),
	usersGroups:   ant_require("modules/usersGroups.js"),
};

const preferences = {
	init() {
		// fast references
		this.title = window.title;
		this.activeSection =
		this.mainMenu = window.find(`content > section[data-view="main"]`);
		this.el = {
			btnPrev: window.find("[data-click='history-go'][data-arg='-1']"),
			btnNext: window.find("[data-click='history-go'][data-arg='1']"),
		};
		this.history = new window.History;
		this.history.push({ view: "main" });
		this.setViewState();

		// tmp
		this.dispatch({ type: "go-to", view: "notifications" })
	},
	dispatch(event) {
		let self = preferences,
			section,
			view,
			name,
			el;
		//console.log(event);
		switch (event.type) {
			// native events
			case "window.focus":
			case "window.blur":
			case "window.keyup":
			case "window.keystroke":
				// prevent fall through to default
				break;
			// custom events
			case "main-menu":
				self.history.push({ view: "main", name: self.title });
				self.setViewState();
				break;
			case "go-to":
				el = window.find(`.section[data-id="${event.view}"]`);
				view = el.data("id");
				name = el.find(".name").text();
				self.history.push({ view, name });
				self.setViewState();
				break;
			case "history-go":
				if (event.arg === "-1") self.history.goBack();
				else self.history.goForward();
				// update view state
				self.setViewState();
				break;
			case "select-section":
				el = $(event.target);
				view = el.data("id");
				name = el.find(".name").text();
				if (!view) return;

				self.history.push({ view, name });
				self.setViewState();
				break;
			default:
				el = event.target ? $(event.target) : event.el;
				if (!el) return;
				section = el.parents("section");
				view = section.data("view");

				// pass on event to part
				parts[view].dispatch({ ...event, section });
		}
	},
	setViewState() {
		let state = this.history.current,
			section = window.find(`section[data-view="${state.view}"]`),
			width = this.mainMenu.width(),
			height = this.mainMenu.height();
		
		// toolbar UI update
		this.el.btnPrev.toggleClass("tool-disabled_", this.history.canGoBack);
		this.el.btnNext.toggleClass("tool-disabled_", this.history.canGoForward);

		if (state.view !== "main") {
			width = section.width();
			height = section.height();
			// pass on view-init event to part
			parts[state.view].dispatch({ type: "init-view", section });
		}

		this.activeSection.removeClass("active");
		this.activeSection = section.addClass("active");

		// update window title
		window.title = state.name;
		// resize window
		window.body.css({
			width: width +"px",
			height: height +"px",
		});
	}
};

window.exports = preferences;
