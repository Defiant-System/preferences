
// parts.general

{
	async dispatch(event) {
		let Self = parts.general,
			shell,
			value,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;

				// accent color
				shell = await defiant.shell(`sys -j`);
				el = Self.section.find(`.color-select_[data-color="${shell.result}"]`);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// menubar toggle
				shell = await defiant.shell(`sys -w`);
				el = Self.section.find(`input[id="menubar-toggle"]`);
				el.prop({ checked: shell.result });

				break;
			case "select-ui-theme":
				el = $(event.target);

				// indicate active theme
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// execute shell command
				defiant.shell(`sys -o ${el.data("arg")}`);
				break;
			case "select-accent-icon-color":
				el = $(event.target);
				if (!el.attr("style")) return;

				// indicate active theme
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// execute shell command
				value = el.attr("style").match(/(#.+);/)[1];
				defiant.shell(`sys -j ${value}`);
				break;
			case "toggle-checkbox-value":
				el = $(event.target);
				if (el.attr("type") !== "checkbox") return;

				// execute shell command
				defiant.shell(`sys -w ${el.is(":checked")}`);
				break;
		}
	}
}
