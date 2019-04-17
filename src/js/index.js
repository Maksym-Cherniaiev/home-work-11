document.getElementById("get-full-data").addEventListener("click", getDataByName);
document.getElementById("get-one-employee").addEventListener("click", getDataByName);
document.getElementById("clear-list").addEventListener("click", getDataByName);


let idCounter = 0;
let buttonId = "btn-id_";

class GetData {
	constructor() {
		this.URL_SERVER = "https://jsonplaceholder.typicode.com/users";
	}

	async employeeData(url) {
		const response = await fetch(url);
		this.data = await response.json();
		return this.data;
	}
}

class Render extends GetData {
	constructor() {
		super();
		this.listContainer = document.querySelector(".employees-container");
		this.searchName = document.querySelector(".search-employee__input").value;
		this.employeeList = document.querySelector(".employees-container__list");
		this.listElementHeightModifier = this.listElementHeightModifier.bind(this);
		this.employeeList.addEventListener("click", this.listElementHeightModifier);
	}

	listElementHeightModifier(event) {
		console.log(this.employeeList.firstChild);
		if (event.target.classList.contains(this.detailsButtonClass)) {
			event.target.closest(`.${this.listElement}`).classList.toggle(this.listElementModifier);
		}
		return event.target;
	}

	createDOMElement(tag, elementClass, id, text) {
		const element = document.createElement(tag);
		element.classList.add(elementClass);
		if (id) { element.id = `${this.createId(id)}` }
		if (text) { element.textContent = text }
		return element;
	}

	createId(elem) {
		idCounter++;
		return elem + idCounter;
	}

	addCreatedElementsToList(block, ...elements) {
		elements.forEach(element => block.appendChild(element));
		return block;
	}
}

class Filter extends Render {
	constructor() {
		super();
		this.listElement = "employees-container__list-element";
		this.listElementModifier = "employees-container__list-element--active";
		this.detailsButtonClass = "list__button";
		this.employeeName = "list__employee-name";
		this.emptyFile = "Employee not found";
	}

	async getAllEmployee() {
		await this.employeeData(this.URL_SERVER);
		this.data.forEach(employee => {
			this.addCreatedElementsToList(this.employeeList, this.addCreatedElementsToList(
				this.createDOMElement("li", this.listElement),
				this.createDOMElement("p", this.employeeName, undefined, employee.name),
				this.createDOMElement("button", this.detailsButtonClass, buttonId, "details")));
		});
		return this.employeeList;
	}

	async getEmployeeByName() {
		await this.employeeData(this.URL_SERVER);
		if (this.searchName === "") {
			this.addCreatedElementsToList(this.employeeList, this.addCreatedElementsToList(
				this.createDOMElement("li", this.listElement), 
				this.createDOMElement("p", this.employeeName, undefined, this.emptyFile)));
		} else {
			this.data.forEach(employee => {
				if (employee.name.toLowerCase().includes(this.searchName.toLowerCase())) {
					this.addCreatedElementsToList(this.employeeList, this.addCreatedElementsToList(
						this.createDOMElement("li", this.listElement),
						this.createDOMElement("p", this.employeeName, undefined, employee.name),
						this.createDOMElement("button", this.detailsButtonClass, buttonId, "details")));
				}
			});
		}
		return this.data;
	}
}

class Remover extends Render {
	constructor() {
		super();
		this.clearPage();
	}

	clearPage() {
		while (this.employeeList.firstChild) {
			this.employeeList.removeChild(this.employeeList.firstChild);
		}
	}
}

function getDataByName(event) {
	const newSearch = new Filter();
	if (event.target.classList.contains("search-employee__button")) {
		newSearch.getEmployeeByName(event);
	} else if (event.target.classList.contains("properties-container__load-list")) {
		newSearch.getAllEmployee();
	} else {
		new Remover();
	}
}