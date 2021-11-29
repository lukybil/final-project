import React from "react";
import '../common.css';
import './NewExperience.css';
import withHooks from "../withHooks";
import restrictAccess from "../decorators/restrictAccess";

const fileToDataUri = (file) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = (event) => {
		resolve(event.target.result)
	};
	reader.readAsDataURL(file);
})

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
		let names = ["name", "img", "country", "city", "description", "documentation", "budget", "transportation", "accomodation"];
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
		this.db.addExp(exp);
		this.props.addSnackbar("success", "Experience added successfully");
	}

	render() {
		let tags = ["cultural", "rural", "historical", "business", "environmental", "eco-tourism"];
		let tagPills = tags.map( (tag) => {
			return <PillCheckbox value={tag} />
		});
		return (
			<div className="NewExperience">
				<form>
					<h2>Add Experience</h2>
					<div className="flex">
						<span>
							<img src={this.state.mainImg} alt="🖼"></img>
						</span>
						<input type="text" id="newExpImg" name="img" placeholder="Main image" onChange={(e) => this.onMainImgChange(e.target.value)}></input>
						<input type="text" id="newExpName" name="name" placeholder="Name"></input>
						<input type="text" id="newExpCountry" name="country" placeholder="Country"></input>
						<input type="text" id="newExpCity" name="city" placeholder="City"></input>
						<textarea type="text" id="newExpDescription" name="description" placeholder="Description"></textarea>
						<textarea id="newExpDocumentation" name="documentation" placeholder="Documentation"></textarea>
						<input type="text" id="newExpBudget" name="budget" placeholder="Budget"></input>
						<textarea id="newExpTrasportation" name="transportation" placeholder="Trasnportation"></textarea>
						<textarea id="newExpAccomodation" name="accomodation" placeholder="Accomodation"></textarea>
						<textarea id="newExpUsefulLinks" name="usefulLinks" placeholder="Useful links"></textarea>
						<div>{tagPills}</div>
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