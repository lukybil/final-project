import React from "react";
import '../common.css';
import './NewExperience.css';
import withHooks from "../withHooks";
import restrictAccess from "../decorators/restrictAccess";
import DB from '../DB';

/** unused function, can be used to save images in Base64 format but is very inefficient and because localStorage is limited in capacity to only 5MB, only around 3 high-quality images could be stored, now using links to online hosted images instead */
const fileToDataUri = (file) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = (event) => {
		resolve(event.target.result)
	};
	reader.readAsDataURL(file);
})

export function Tags(props) {
	let tags = DB.tags;
	let tagPills = tags.map( (tag) => {
		return <PillCheckbox value={tag} />
	});
	return (
		<div>{tagPills}</div>
	);
}

function PillCheckbox(props) {
	return (	
		<label className="PillCheckbox no-selection">
			<input type="checkbox" name="tags" value={props.value}/>
			<span>{props.value}</span>
		</label>
	);
}

class NewExperience extends React.Component {
	constructor(props) {
		super(props);
		this.state = {mainImg: ""};
		this.db = props.db;
	}

	onFileChange = (file) => {
		if(!file) {
				this.setState({dataUri: ''});
		return;
		}
		fileToDataUri(file)
		.then(dataUri => {
			this.setState({dataUri: dataUri});
		})
	}
	
	onMainImgChange(src) {
		this.setState({mainImg: src});
	}

	onSubmit(e) {
		e.preventDefault();
		let username;
		if ((username = this.db.getCurrentUser().username) === "Guest") {
			this.props.addSnackbar("info", "You have to sign in to add experiences.")
			return;
		}
		let names = ["name", "img", "country", "city", "description", "documentation", "transportation", "accomodation"];
		let exp = {};
		names.forEach( (n) => {
			exp[n] = document.querySelector("input[name=" + n + "],textarea[name=" + n + "]")?.value;
		});
		//exp.img = this.state.dataUri;
		exp.username = username;
		exp.tags = [];
		document.querySelectorAll(".PillCheckbox input:checked").forEach( (input) => {
			exp.tags.push(input.value);
		});

		exp.budget = {};
		exp.budget.from = document.querySelector("input[name=budgetFrom]")?.value;
		exp.budget.to = document.querySelector("input[name=budgetTo]")?.value;
		exp.budget.notes = document.querySelector("textarea[name=budgetNotes]")?.value;

		this.db.addExp(exp);
		this.props.addSnackbar("success", "Experience added successfully");
	}

	render() {
		return (
			<div className="NewExperience">
				<form>
					<h2>Add Experience</h2>
					<div className="flex">
						<span>
							<img src={this.state.mainImg} alt="🖼"></img>
						</span>
						<label for="newExpImg">Main image</label>
						<input type="text" id="newExpImg" name="img" placeholder="Main image" onChange={(e) => this.onMainImgChange(e.target.value)}></input>
						<label for="newExpName">Name</label>
						<input type="text" id="newExpName" name="name" placeholder="Name"></input>
						<label for="newExpCountry">Country</label>
						<input type="text" id="newExpCountry" name="country" placeholder="Country"></input>
						<label for="newExpCity">City</label>
						<input type="text" id="newExpCity" name="city" placeholder="City"></input>
						<label for="newExpDescription">Description</label>
						<textarea type="text" id="newExpDescription" name="description" placeholder="Description"></textarea>
						<label for="newExpDocumentation">Documentation</label>
						<textarea id="newExpDocumentation" name="documentation" placeholder="Documentation"></textarea>

						<div className="newExpBudget">
							<span>Budget</span>
							<label for="newExpBudgetFrom">Budget From</label>
							<input type="number" id="newExpBudgetFrom" name="budgetFrom" placeholder="From"></input>
							<label for="newExpBudgetTo">Budget To</label>
							<input type="number" id="newExpBudgetTo" name="budgetTo" placeholder="To"></input>
							<label for="newExpBudgetNotes">Budget notes</label>
							<textarea type="text" id="newExpBudgetNotes" name="budgetNotes" placeholder="Notes"></textarea>
						</div>

						<label for="newExpTrasportation">Transportation</label>
						<textarea id="newExpTrasportation" name="transportation" placeholder="Trasnportation"></textarea>
						<label for="newExpAccomodation">Accomodation</label>
						<textarea id="newExpAccomodation" name="accomodation" placeholder="Accomodation"></textarea>
						<label for="newExpUsefulLinks">Useful links</label>
						<textarea id="newExpUsefulLinks" name="usefulLinks" placeholder="Useful links"></textarea>
						<Tags/>
						<button className="button-primary" onClick={e => this.onSubmit(e)}>Add experience</button>
					</div>
				</form>
			</div>
		);
	}
}

export default withHooks(NewExperience);

/*

						<label htmlFor="newExpImg">
							<img src={this.state.dataUri} alt="Upload picture"></img>	
						</label>		
						<input type="file" id="newExpImg" name="img" onChange={(e) => this.onFileChange(e.target.files[0])}></input>
*/