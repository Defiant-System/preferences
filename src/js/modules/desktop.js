
// parts.desktop

{
	bgComplexRx: /url|gradient/i,
	bgRexExp: /(?:\(['"]?)(.*?)(?:['"]?\))/,
	async dispatch(event) {
		let self = parts.desktop,
			section = self.section,
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
					self.section = event.section;
					self.wideWsEl = self.section.find(".workspace-wide");
					self.reelEl = self.section.find(".reel");
					self.treeEl = self.section.find(".tree");
					self.listEl = self.section.find(".list");

					// get wallpaper info from system
					shell = await defiant.shell("ws -a wallpaper");

					// set number of desktops
					self.reelEl.data("ws", shell.result.length);

					shell.result.map(item => {
						if (!style && item.wide) isWide = true;
						if (!style) style = item.value;

						self.section
							.find(`.workspace[data-id="${item.name}"] div`)
							.attr({ style: item.value });
					});

					if (isWide) {
						self.reelEl.addClass("wide");
						self.wideWsEl.find("div").attr({ style });
						active = self.wideWsEl;
					} else {
						active = self.section.find(".workspace:first");
					}

					// is wide bg active
					self.section.toggleClass("wide-wp", isWide);

					// render tree view
					window.render({
						template: "bg-tree",
						match: `//Data/Desktop`,
						target: self.treeEl
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
				active = self.reelEl.find("> div.active div");
				style = active.attr("style");				
				if (self.bgComplexRx.exec(style)) {
					style = self.bgRexExp.exec(style)[1];
					active = window.bluePrint.selectSingleNode(`//i[contains(text(), "${style}")]`);
					name = active ? active.parentNode.getAttribute("name") : "Wallpapers"
					item = self.treeEl.find(`.tree-item .name:contains("${name}")`);
				} else {
					item = self.treeEl.find(`.tree-item .name:contains("Colors")`);
				}
				if (!item.length) self.treeEl.find(".tree-item:nth-child(1) .name").trigger("click");
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
					target: self.listEl.scrollTop(0)
				});

				// make "active" in list
				active = self.reelEl.find("> .active div");
				style = active.attr("style");
				if (self.bgComplexRx.exec(style)) style = self.bgRexExp.exec(style)[1];
				active = self.listEl.find(`div[style*="${style}"]`);
				if (active.length) active.addClass("active").scrollIntoView();

				self.listEl.toggleClass("wide-wp", el.data("type") !== "wide");
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
				value = +self.reelEl.data("ws");
				siblings = self.reelEl.find("> div");
				style = siblings.get(value).find("div").attr("style");

				// duplicate previous sibling bg
				siblings.get(value + 1).find("div").attr({ style });
				
				self.reelEl.data({ ws: value + 1 });
				break;
			case "remove-workspace":
				el = $(event.target);
				console.log(el);
				break;
		}
	}
}
