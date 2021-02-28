
const parts = {
	accessibility: @import "modules/accessibility.js",
	dateTime:      @import "modules/dateTime.js",
	desktop:       @import "modules/desktop.js",
	displays:      @import "modules/displays.js",
	dock:          @import "modules/dock.js",
	general:       @import "modules/general.js",
	cloudStorage:  @import "modules/cloudStorage.js",
	integrations:  @import "modules/integrations.js",
	keyboard:      @import "modules/keyboard.js",
	language:      @import "modules/language.js",
	mouse:         @import "modules/mouse.js",
	notifications: @import "modules/notifications.js",
	screenSaver:   @import "modules/screenSaver.js",
	security:      @import "modules/security.js",
	sharing:       @import "modules/sharing.js",
	sound:         @import "modules/sound.js",
	spotlight:     @import "modules/spotlight.js",
	updates:       @import "modules/updates.js",
	usersGroups:   @import "modules/usersGroups.js",
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
		// this.dispatch({ type: "go-to", view: "cloudStorage" })
		this.dispatch({ type: "go-to", view: "usersGroups" })
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
				// prevents fall through to default
				break;
			case "window.keystroke":
				// enter on login dialog
				view = Self.history.current.view;
				section = window.find(`section[data-view="${view}"]`);
				// pass on event to part
				if (parts[view]) {
					parts[view].dispatch({ ...event, section });
				}
				break;
			case "window.keydown":
				if (event.target && event.keyCode === 13) {
					// enter on login dialog
					view = Self.history.current.view;
					section = window.find(`section[data-view="${view}"]`);
					if (parts[view]) {
						// pass on event to part
						parts[view].dispatch({ ...event, section });
					}
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
