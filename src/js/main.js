
const parts = {
	accessibility: defiant.require("modules/accessibility.js"),
	dateTime:      defiant.require("modules/dateTime.js"),
	desktop:       defiant.require("modules/desktop.js"),
	displays:      defiant.require("modules/displays.js"),
	dock:          defiant.require("modules/dock.js"),
	general:       defiant.require("modules/general.js"),
	cloudStorage:  defiant.require("modules/cloudStorage.js"),
	integrations:  defiant.require("modules/integrations.js"),
	keyboard:      defiant.require("modules/keyboard.js"),
	language:      defiant.require("modules/language.js"),
	mouse:         defiant.require("modules/mouse.js"),
	notifications: defiant.require("modules/notifications.js"),
	screenSaver:   defiant.require("modules/screenSaver.js"),
	security:      defiant.require("modules/security.js"),
	sharing:       defiant.require("modules/sharing.js"),
	sound:         defiant.require("modules/sound.js"),
	spotlight:     defiant.require("modules/spotlight.js"),
	updates:       defiant.require("modules/updates.js"),
	usersGroups:   defiant.require("modules/usersGroups.js"),
};

const preferences = {
	views: {},
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
		//this.views = { isUnlocked: true, password: "temp" };
		this.dispatch({ type: "go-to", view: "cloudStorage" })
		//this.dispatch({ type: "go-to", view: "desktop" })
	},
	dispatch(event) {
		let Self = preferences,
			section,
			view,
			name,
			el;
		switch (event.type) {
			// native events
			case "window.focus":
			case "window.blur":
			case "window.keystroke":
				// prevents fall through to default
				break;
			case "window.keydown":
				if (event.target && event.keyCode === 13) {
					// enter on login dialog
					view = Self.history.current.view;
					section = window.find(`section[data-view="${view}"]`);
					// pass on event to part
					parts[view].dispatch({ ...event, section });
				}
				break;
			// custom events
			case "main-menu":
				Self.history.push({ view: "main", name: Self.title });
				Self.setViewState();
				break;
			case "go-to":
				el = window.find(`.section[data-id="${event.view}"]`);
				view = el.data("id");
				name = el.find(".name").text();
				Self.history.push({ view, name });
				Self.setViewState();
				break;
			case "history-go":
				if (event.arg === "-1") Self.history.goBack();
				else Self.history.goForward();
				// update view state
				Self.setViewState();
				break;
			case "select-section":
				el = $(event.target);
				view = el.data("id");
				name = el.find(".name").text();
				if (!view) return;

				Self.history.push({ view, name });
				Self.setViewState();
				break;
			default:
				if (typeof event === "string") {
					// event is a "shortcut" to a view
					return Self.dispatch({ type: "go-to", view: event });
				}
				el = event.target ? $(event.target) : event.el;
				if (el) section = el.parents("section");

				if (!section || !section.length) {
					view = Self.history.current.view;
					section = window.find(`section[data-view="${view}"]`);
				}
				view = section.data("view");

				// pass on event to part
				if (parts[view]) {
					parts[view].dispatch({ ...event, section });
				}
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
