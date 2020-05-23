
// parts.dock

{
	dispatch(event) {
		let self = parts.dock,
			value,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
			case "select-dock-position":
				el = $(event.target);
				if (el.attr("type") !== "radio") return;
				
				value = el.attr("id").split("-")[1];
				defiant.shell("sys -d "+ value);
				break;
			case "icon-size":
				console.log(event);
				break;
			case "toggle-dock":
				console.log(event);
				break;
			case "app-indicators":
				console.log(event);
				break;
			case "show-recent":
				console.log(event);
				break;
		}
	}
}
