
const parts = {
	general:       ant_require("modules/general.js"),
	desktop:       ant_require("modules/desktop.js"),
	language:      ant_require("modules/language.js"),
	spotlight:     ant_require("modules/spotlight.js"),
	notifications: ant_require("modules/notifications.js"),
	displays:      ant_require("modules/displays.js"),
	keyboard:      ant_require("modules/keyboard.js"),
	mouse:         ant_require("modules/mouse.js"),
	sound:         ant_require("modules/sound.js"),
	security:      ant_require("modules/security.js"),
	integrations:  ant_require("modules/integrations.js"),
	updates:       ant_require("modules/updates.js"),
	sharing:       ant_require("modules/sharing.js"),
	userGroups:    ant_require("modules/userGroups.js"),
	dateTime:      ant_require("modules/dateTime.js"),
	accessibility: ant_require("modules/accessibility.js"),
};

const preferences = {
	init() {
		// fast references
		this.activeSection =
		this.mainMenu = window.find(`content > section[data-view="Main"]`);
		this.el = {
			btnPrev: window.find("[data-click='history-go'][data-arg='-1']"),
			btnNext: window.find("[data-click='history-go'][data-arg='1']"),
		};
		this.history = new window.History;
		this.history.push({ view: "Main" });
		this.setViewState();
		
		// tmp
		//window.find(`section[data-view="main"] .section:nth(0)`).trigger("click");
		//window.find(`section[data-view="Desktop"] .tab-row_ > div:nth(1)`).trigger("click");

		//window.find(`section[data-view="main"] .section:nth(17)`).trigger("click");
	},
	dispatch(event) {
		let self = preferences,
			state,
			section,
			workspace,
			view,
			index,
			value,
			flag,
			el;
		switch (event.type) {
			case "history-go":
				if (event.arg === "-1") self.history.goBack();
				else self.history.goForward();

				// update view state
				self.setViewState();
				break;
			case "main-menu":
				self.history.push({view: "Main"});
				self.setViewState();
				break;
			case "select-section":
				el = $(event.target);
				if (!el.hasClass("section")) el = el.parents(".section");

				view = el.find(".name").text();
				self.history.push({ view });
				self.setViewState();
				break;
			case "set-highlight-color":
			case "set-sidebar-icon-size":
				console.log(event);
				break;
			case "select-folder-icon-color":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				console.log(el.css("background-color"));
				break;
			case "select-workspace":
				el = $(event.target);
				if (!el.hasClass("workspace")) return;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				break;
			case "select-bg-folder":
				el = $(event.target);
				if (!el.hasClass("tree-item")) return;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				section = el.parents("section[data-view]");
				name = el.find("span.name").text();
				window.render({
					template: "bg-list",
					match: `//Data/Desktop/i[@name="${name}"]`,
					target: section.find(".list").scrollTop(0)
				});

				section.toggleClass("wide-wp", el.attr("data-type") !== "wide");
				break;
			case "select-bg-item":
				el = $(event.target);
				if (!el.hasClass("bg-preview")) return;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				section = window.find(`section[data-view="Desktop"]`);
				value = el.attr("style");

				if (el.parent().hasClass("wide-wp")) {
					section.find(".reel").addClass("wide");
					workspace = section.find(".workspace-wide").addClass("active");
					workspace.find("div").attr({style: value});
					index = "wide";
				} else {
					section.find(".reel").removeClass("wide");
					workspace = section.find(".workspace.active");
					workspace.find("div").attr({style: value});
					index = workspace.index();
				}
				value = value.replace(/\?.+?\)/g, ")");
				defiant.shell(`ws -w ${index} '${value}'`);
				break;
		}
	},
	async setViewState() {
		let state = this.history.current,
			section = window.find(`section[data-view="${state.view}"]`),
			width = this.mainMenu.width(),
			height = this.mainMenu.height();
		
		// toolbar UI update
		this.el.btnPrev.toggleClass("tool-disabled_", this.history.canGoBack);
		this.el.btnNext.toggleClass("tool-disabled_", this.history.canGoForward);

		if (state.view !== "Main") {
			width = section.width();
			height = section.height();
		}

		switch (state.view) {
			case "Main":
				break;
			case "Desktop":
				// ignore if already rendered
				if (!section.find(".tree .tree-item").length) {
					let shell = await defiant.shell("ws -a wallpaper"),
						isWide;
					shell.result.map((item, index) => {
						if (index === 0 && item.wide) {
							isWide = item.value;
						}
						window.body.find(`.workspace[data-id="${item.name}"] div`).attr({
							style: item.value
						});
					});
					if (isWide) {
						view.find(".reel").addClass("wide");
						view.find(".workspace-wide.active").find("div").attr({style: isWide});
					}

					window.render({
						template: "bg-tree",
						match: `//Data/Desktop`,
						target: section.find(".tree")
					});

					window.render({
						template: "bg-list",
						match: `//Data/Desktop/i[@name="Ultra-Wide"]`,
						target: section.find(".list")
					});
				}
				break;
		}

		this.activeSection.removeClass("active");
		this.activeSection = section.addClass("active");

		window.body.css({
			width: width +"px",
			height: height +"px",
		});
	}
};

window.exports = preferences;
