
// Section.dock

{
	async dispatch(event) {
		let Self = Section.dock,
			shell,
			value,
			size,
			el;
		switch (event.type) {
			case "init-view":
				// fast references
				Self.section = event.section;
				Self.rowMagnification = Self.section.find(".row-group_[data-row='magnification']");
				Self.inputMagnification = Self.rowMagnification.find("input");

				// dock position
				shell = await defiant.shell(`sys -d`);
				el = Self.section.find(`input[id="dock-${shell.result}"]`);
				el.prop({ checked: true });

				// dock size
				shell = await defiant.shell(`sys -e`);
				Self.section.find("input#dock-size").val(shell.result);

				// dock show/hide
				shell = await defiant.shell(`sys -h`);
				el = Self.section.find(`input[id="toggle-dock"]`);
				el.prop({ checked: shell.result });

				// dock app indicators
				shell = await defiant.shell(`sys -f`);
				el = Self.section.find(`input[id="toggle-app-indicators"]`);
				el.prop({ checked: shell.result });

				// dock magnification
				shell = await defiant.shell(`sys -g`);
				el = Self.section.find(`input[id="toggle-magnification"]`);
				el.prop({ checked: shell.result.on });
				if (shell.result.on) {
					Self.dispatch({ type: "toggle-values", target: el[0], fake: true });
				}
				Self.inputMagnification.val(shell.result.size);
				break;
			case "select-dock-position":
				el = $(event.target);
				if (el.attr("type") !== "radio") return;
				value = el.attr("id").split("-")[1];
				// save value in settings
				defiant.shell("sys -d "+ value);
				break;
			case "dock-size":
				// save value in settings
				defiant.shell(`sys -e ${event.value}`);
				break;
			case "magnification-size":
				// save value in settings
				defiant.shell(`sys -g true ${event.value}`);
				break;
			case "toggle-values":
				el = $(event.target);
				if (el.attr("type") !== "checkbox") return;
				value = el.is(":checked");

				switch (el.attr("id")) {
					case "toggle-dock":
						defiant.shell(`sys -h ${value}`);
						break;
					case "toggle-app-indicators":
						defiant.shell(`sys -f ${value}`);
						break;
					case "toggle-magnification":
						Self.rowMagnification.toggleClass("disabled_", value);
						// toggles range fields
						if (value) Self.inputMagnification.removeAttr("disabled");
						else Self.inputMagnification.attr({ disabled: "disabled" });

						// return if it is a fake event
						if (event.fake) return;

						// save value in settings
						size = Self.inputMagnification.val();
						defiant.shell(`sys -g ${value} ${size}`);
						break;
				}
				break;
		}
	}
}
