
// parts.cloudStorage

{
	dispatch(event) {
		let self = parts.cloudStorage,
			el;
		switch (event.type) {
			case "init-view":
				self.section = event.section;
				break;
			case "add-storage":
			case "remove-storage":
				break;
		}
	}
}


// Root.shell_.execute_(`win -o preferences { type: "go-to", view: "cloudStorage" }`);
