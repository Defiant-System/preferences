
// parts.cloudStorage

{
	dispatch(event) {
		let Self = parts.cloudStorage,
			xpath,
			node,
			changePath,
			changeSelect,
			match,
			target,
			value,
			active,
			el;
		switch (event.type) {
			// native events
			case "window.keystroke":
				if (!event.target) return;
				// handle input event
				el = $(event.target);
				if (el.attr("name") === "storage-name") {
					// put entered value into selected item in left panel
					value = el.val() || el.attr("placeholder");
					Self.section.find(".panel-left .active .name").html(value);
				}
				break;
			// custom events
			case "init-view":
				// ignore if already rendered
				if (event.section.find(".panel-left .storage").length) return;

				Self.section = event.section;

				// render tree view
				el = Self.section.find(".panel-left");
				match = `//Settings//block[@id="external-storage"]`;
				window.render({ template: "storage-list", prepend: el, match });

				// hide legend if no external storage in list
				el = Self.section.find("legend").get(1);
				el.toggleClass("hidden", el.nextAll(".storage").length > 0);

				// make first active
				Self.section.find(".panel-left .storage").get(0).trigger("click");

				// temp
				setTimeout(() => {
					// return Self.section.find(".panel-left .storage").get(2).trigger("click");

					Self.dispatch({ type: "add-storage" });
					// Self.dispatch({ type: "cloud-storage-connected" });
				}, 1000);
				break;
			case "show-section-help":
				defiant.shell("fs -u '~/help/cloud-storage.md'");
				break;
			case "select-storage":
				el = $(event.target);

				// remove any "new storage", if there is one
				active = el.parent().find(".storage[data-id='new-storage']");
				if (active[0] !== el[0]) active.remove();

				// conditional checks
				if (el.hasClass("active") || !el.hasClass("storage")) return;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				// toogle "remove storage" - depending on selection
				Self.section.find(".panel-left .option-button[data-click='remove-storage']")
					.toggleClass("disabled", el.data("id") !== "defiant-cloud");

				target = Self.section.find(".tab-body_");
				match = el.data("id") === "defiant-cloud"
							? `//FileSystem`
							: `//block[@id="external-storage"]/*[@icon="${el.data("id")}"]`;

				// storage base
				changePath = "/*[@name='baseDir']";
				changeSelect = "//FileSystem";
				value = el.data("path");
				if (value) {
					value = value.slice(value.lastIndexOf("/") + 1)
					changeSelect = `//*[@name='Mount']/*[@name='${value}']`;
				}

				// render storage details
				window.render({ template: "storage-details", changePath, changeSelect, match, target });

				// auto focus input field
				if (el.data("id") === "new-storage") {
					target.find("input[name='storage-name']").select();
				}
				break;
			case "select-storage-type":
				target = Self.section.find(`input[name='storage-name']`);
				active = event.el.find("option[selected]");
				if (!active.length) return;

				if (!target.val()) {
					target.val(active.text());
					// trigger fake event
					Self.dispatch({ type: "window.keystroke", target });
				}
				// update icon in left panel
				Self.section.find(`.storage[data-id="new-storage"] > i`)
					.prop({ className: "icon-"+ active.attr("value") });
				// enable connect button
				Self.section.find(`button[data-click="connect-storage"]`).removeAttr("disabled");
				break;
			case "add-storage":
				active = Self.section.find(".panel-left .storage[data-id='new-storage']");
				if (active.length) return;

				let xBlock = window.bluePrint.selectSingleNode("sys://block[@id='external-storage']");
				node = xBlock.appendChild($.nodeFromString(`<item icon="new-storage"/>`));

				// render tree view
				el = Self.section.find(".panel-left .storage-list");
				match = `//block[@id="external-storage"]/*[@icon="new-storage"]`;
				// render contents
				window.render({ template: "storage-list-item", append: el, match });

				// auto select new storage
				el.find(".storage:last").trigger("click");

				// hide legend if no external storage in list
				el = Self.section.find("legend").get(1);
				el.toggleClass("hidden", el.nextAll(".storage").length > 0);

				// remove temp node
				node.parentNode.removeChild(node);
				break;
			case "connect-storage":
				el = event.el.parents(".tab-active_");
				el.addClass("connecting");
				el.find(".loading").removeClass("paused");
				el.find("selectbox").attr({ disabled: true });

				// listen to callback event
				defiant.once("sys:storage-connected", Self.dispatch);
				// signlar defiant to add storage
				defiant.storage.add({
					id: el.find("selectbox").val(),
					name: el.find("input[name='storage-name']").val(),
				});
				break;
			case "storage-connected":
				if (event.detail.success) {
					el = Self.section.find(".tab-active_");
					el.removeClass("connecting").addClass("connected");
					el.find(".loading").addClass("paused");
					// left panel
					let sItem = Self.section.find(`.panel-left .storage[data-id="new-storage"]`);
					sItem.data({
						id: event.detail.id,
						path: event.detail.path,
					});
					sItem.find(".size").html( defiant.formatBytes(event.detail.quota) );
					
					// TODO: render disc-bar
					sItem.removeClass("active").trigger("click");
				} else {
					// failed to connect
					window.dialog.alert({ message: "Failed to connect..." });
				}
				break;
			case "storage-disconnected":
				el = Self.section.find(`.panel-left .storage[data-id="${event.detail.id}"]`);
				node = el.prevAll(".storage").get(0);
				// remove element from DOM
				el.remove();
				// hide legend if no external storage in list
				el = Self.section.find("legend").get(1);
				el.toggleClass("hidden", el.nextAll(".storage").length > 0);
				// make active previous suibling
				node.trigger("click");
				break;

			case "remove-storage":
				if (event.el.hasClass("disabled")) return;
				// conditional check to see if this is temp "new storage"
				el = Self.section.find(".panel-left .active");
				if (el.data("id") === "new-storage") {
					// find sibling to focus
					node = el.prevAll(".storage").get(0);
					// remove item
					el.remove();
					// make previous active
					return node.trigger("click");
				}
				// show custom confirm dialog
				window.dialog.show({ name: "confirm-remove-storage" });
				break;
			// remove dialog
			case "dialog-remove-storage-ok":
				el = Self.section.find(".panel-left .active");

				// listen to callback event
				defiant.once("sys:storage-disconnected", Self.dispatch);
				// signlar defiant to remove storage
				defiant.storage.remove({
					id: el.data("id"),
					name: el.find(".name").text(),
				});
				/* falls through */
			case "dialog-remove-storage-cancel":
				// close unlock dialog
				window.dialog.close();
				break;
		}
	}
}
