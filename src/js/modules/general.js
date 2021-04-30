
// Section.general

{
	async dispatch(event) {
		let Self = Section.general,
			shell,
			value,
			el;
		switch (event.type) {
			case "init-view":
				Self.section = event.section;

				// theme value
				shell = await defiant.shell(`sys -o`);
				el = Self.section.find(`.theme-preview[data-arg="${shell.result}"]`);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// accent color
				shell = await defiant.shell(`sys -j`);
				el = Self.section.find(`.color-select_[data-arg="${shell.result}"]`);
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
				defiant.shell(`sys -j ${el.data("arg")}`);
				break;
			case "toggle-menubar":
				el = $(event.target);
				if (el.attr("type") !== "checkbox") return;

				// execute shell command
				defiant.shell(`sys -w ${el.is(":checked")}`);
				break;
		}
	}
}
