
// parts.desktop

{
	bgRexExp: /(?:\(['"]?)(.*?)(?:['"]?\))/,
	async dispatch(event) {
		let self = parts.desktop,
			section = self.section,
			shell,
			isWide,
			bgStr,
			active,
			item,
			name,
			value,
			el;
		switch (event.type) {
			case "init-view":
				// ignore if already rendered
				if (!event.section.find(".tree .tree-item").length) {
					// fast references
					self.section = event.section;
					self.reelEl = self.section.find(".reel");
					self.treeEl = self.section.find(".tree");
					self.listEl = self.section.find(".list");

					shell = await defiant.shell("ws -a wallpaper");

					self.reelEl.addClass("wp-count-"+ shell.result.length);

					shell.result.map(item => {
						if (!bgStr && item.wide) isWide = true;
						if (!bgStr) bgStr = item.value;

						self.section
							.find(`.workspace[data-id="${item.name}"] div`)
							.attr({ style: item.value });
					});

					if (isWide) {
						self.reelEl.addClass("wide");
						self.section.find(".workspace-wide.active div").attr({style: bgStr});
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
					self.section.find(".workspace:first").trigger("click");
				}
				break;
			case "select-workspace":
				el = $(event.target);
				if (el.hasClass("active")) return;
				
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// select folder containing current wallpaper
				active = self.section.find(".workspace.active div");
				bgStr = self.bgRexExp.exec(active.attr("style"))[1];
				active = window.bluePrint.selectSingleNode(`//i[contains(text(), "${bgStr}")]`);
				name = active ? active.parentNode.getAttribute("name") : "Wallpapers"
				item = self.treeEl.find(`.tree-item .name:contains("${name}")`);

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
				active = self.section.find(".workspace.active div");
				bgStr = self.bgRexExp.exec(active.attr("style"))[1];
				active = self.listEl.find(`div[style*="${bgStr}"]`);
				if (active.length) {
					active.addClass("active").scrollIntoView();
				}

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
				break;
			case "remove-workspace":
				break;
		}
	}
}
