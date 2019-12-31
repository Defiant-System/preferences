
const preferences = {
	init() {
		// fast references
		this.windowBody = window.find(".window-body_");
		this.activeSection =
		this.mainMenu = window.find(`content > section[data-view="main"]`);
		
		this.dispatch({type: "main-menu"});

		// tmp
		window.find(`section[data-view="main"] .section:nth(1)`).trigger("click");
		window.find(`section[data-view="Desktop"] .tab-row_ > div:nth(0)`).trigger("click");

		//window.find(`section[data-view="main"] .section:nth(17)`).trigger("click");
	},
	dispatch(event) {
		let el,
			section,
			workspace,
			index,
			value,
			flag;
		switch (event.type) {
			case "main-menu":
				this.activeSection.removeClass("active");
				this.mainMenu.addClass("active");
		
				this.windowBody.css({
					width: this.mainMenu.width() +"px",
					height: this.mainMenu.height() +"px",
				});
				break;
			case "select-section":
				el = $(event.target);
				if (!el.hasClass("section")) el = el.parents(".section");

				value = el.find(".name").text();
				section = window.find(`section[data-view="${value}"]`);

				this.windowBody.css({
					width: section.width() +"px",
					height: section.height() +"px",
				});
				
				this.mainMenu.removeClass("active");
				this.activeSection = section.addClass("active");

				this.renderView({view: value});
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

				this.renderView({
					view: "Desktop - List",
					folder: el.find("span.name").text(),
					type: el.attr("data-type")
				});
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
	async renderView(event) {
		let view = window.find(`section[data-view="${event.view}"]`);

		switch (event.view) {
			case "Desktop":
				if (view.find(".tree .tree-item").length) return;

				let shell = await defiant.shell("ws -a wallpaper"),
					isWide;
				shell.result.map((item, index) => {
					if (index === 0 && item.wide) {
						isWide = item.value;
					}
					preferences.windowBody.find(`.workspace[data-id="${item.name}"] div`).attr({
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
					target: view.find(".tree")
				});

				window.render({
					template: "bg-list",
					match: `//Data/Desktop/i[@name="Ultra-Wide"]`,
					target: view.find(".list")
				});
				break;
			case "Desktop - List":
				window.render({
					template: "bg-list",
					match: `//Data/Desktop/i[@name="${event.folder}"]`,
					target: view.find(".list").scrollTop(0)
				});

				view.toggleClass("wide-wp", event.type !== "wide");
				break;
		}
	}
};

window.exports = preferences;
