
// parts.dock

{
	async dispatch(event) {
		let Self = parts.dock,
			shell,
			value,
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

				// dock show/hide
				shell = await defiant.shell(`sys -h`);
				el = Self.section.find(`input[id="toggle-dock"]`);
				el.prop({ checked: shell.result });

				// dock app indicators
				shell = await defiant.shell(`sys -l`);
				el = Self.section.find(`input[id="toggle-app-indicators"]`);
				el.prop({ checked: shell.result });

				break;
			case "select-dock-position":
				el = $(event.target);
				if (el.attr("type") !== "radio") return;
				
				value = el.attr("id").split("-")[1];
				defiant.shell("sys -d "+ value);
				break;
			case "icon-size":
				console.log(event.value);
				break;
			case "magnification-size":
				console.log(event.value);
				break;
			case "toggle-values":
				el = $(event.target);
				if (el.attr("type") !== "checkbox") return;
				value = el.is(":checked");

				switch (el.attr("id")) {
					case "toggle-dock":
						await defiant.shell(`sys -h ${value}`);
						break;
					case "toggle-app-indicators":
						await defiant.shell(`sys -l ${value}`);
						break;
					case "toggle-magnification":
						Self.rowMagnification.toggleClass("disabled_", value);
						// toggles range fields
						if (value) Self.inputMagnification.removeAttr("disabled");
						else Self.inputMagnification.attr({ disabled: "disabled" });
						break;
				}
				break;
		}
	}
}
