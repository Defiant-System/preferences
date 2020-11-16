
// parts.desktop

{
	bgComplexRx: /url|gradient/i,
	bgRexExp: /(?:\(['"]?)(.*?)(?:['"]?\))/,
	async dispatch(event) {
		let Self = parts.desktop,
			section = Self.section,
			workspace,
			index,
			shell,
			isWide,
			style,
			active,
			item,
			name,
			value,
			siblings,
			el;
		switch (event.type) {
			case "init-view":
				// ignore if already rendered
				if (!event.section.find(".tree .tree-item").length) {
					// fast references
					Self.section = event.section;
					Self.wideWsEl = Self.section.find(".workspace-wide");
					Self.reelEl = Self.section.find(".reel");
					Self.treeEl = Self.section.find(".tree");
					Self.listEl = Self.section.find(".list");

					// get wallpaper info from system
					shell = await defiant.shell("ws -a wallpaper");

					// set number of desktops
					Self.reelEl.data("ws", shell.result.length);

					shell.result.map(item => {
						if (!style && item.wide) isWide = true;
						if (!style) style = item.value;

						Self.section
							.find(`.workspace[data-id="${item.name}"] div`)
							.attr({ style: item.value });
					});

					if (isWide) {
						Self.reelEl.addClass("wide");
						Self.wideWsEl.find("div").attr({ style });
						active = Self.wideWsEl;
					} else {
						active = Self.section.find(".workspace:first");
					}

					// is wide bg active
					Self.section.toggleClass("wide-wp", isWide);

					// render tree view
					window.render({
						template: "bg-tree",
						match: `//Data/Desktop`,
						target: Self.treeEl
					});

					// select first workspace
					active.trigger("click");
				}
				break;
			case "select-workspace":
				el = $(event.target);
				if (el.hasClass("active") || !el.data("id")) return;
				
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// select folder containing current wallpaper
				active = Self.reelEl.find("> div.active div");
				style = active.attr("style");				
				if (Self.bgComplexRx.exec(style)) {
					style = Self.bgRexExp.exec(style)[1];
					active = window.bluePrint.selectSingleNode(`//i[contains(text(), "${style}")]`);
					name = active ? active.parentNode.getAttribute("name") : "Wallpapers"
					item = Self.treeEl.find(`.tree-item .name:contains("${name}")`);
				} else {
					item = Self.treeEl.find(`.tree-item .name:contains("Colors")`);
				}
				if (!item.length) Self.treeEl.find(".tree-item:nth-child(1) .name").trigger("click");
				else item.parent().trigger("click");
				break;
			case "select-bg-folder":
				el = $(event.target);
				if (!el.hasClass("tree-item")) return;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				value = el.find("span.name").text();
				window.render({
					template: "bg-list",
					match: `//Data/Desktop/i[@name="${value}"]`,
					target: Self.listEl.scrollTop(0)
				});

				// make "active" in list
				active = Self.reelEl.find("> .active div");
				style = active.attr("style");
				if (Self.bgComplexRx.exec(style)) style = Self.bgRexExp.exec(style)[1];
				active = Self.listEl.find(`div[style*="${style}"]`);
				if (active.length) active.addClass("active").scrollIntoView();

				Self.listEl.toggleClass("wide-wp", el.data("type") !== "wide");
				break;
			case "select-bg-item":
				el = $(event.target);
				if (!el.hasClass("bg-preview")) return;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

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
			case "add-workspace":
				value = +Self.reelEl.data("ws");
				siblings = Self.reelEl.find("> div");
				style = siblings.get(value).find("div").attr("style");

				// duplicate previous sibling bg
				siblings.get(value + 1).find("div").attr({ style });
				
				Self.reelEl.data({ ws: value + 1 });

				// todo: interact with workspace to add / remove workspaces
				break;
			case "remove-workspace":
				value = +Self.reelEl.data("ws");
				Self.reelEl.data({ ws: value - 1 });
				
				// todo: interact with workspace to add / remove workspaces
				break;
		}
	}
}
