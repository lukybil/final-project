import React from "react"
import MySnackbar from "../MySnackbar";
import '../common.css';
import './NewExperience.css';

const fileToDataUri = (file) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onload = (event) => {
		resolve(event.target.result)
	};
	reader.readAsDataURL(file);
})

class NewExperience extends React.Component {
	constructor(props) {
		super(props);
		this.state = {snackbar: {open: false, severity: "info", message: ""}};
		this.db = props.db;
	}

	onChange = (file) => {
    
    if(!file) {
			this.setState({dataUri: ''});
      return;
    }

    fileToDataUri(file)
      .then(dataUri => {
        this.setState({dataUri: dataUri});
      })
    
  }
//TODO: username is missing
	onSubmit(e) {
		e.preventDefault();
		let username;
		if ((username = this.db.getCurrentUser().username) === "Guest") {
			this.setState({snackbar: {open: true, message: "You have to sign in to add experiences.", severity: "info"}});
			return;
		}
		let names = ["name", "country", "city", "documentation", "budget", "transportation", "accomodation"];
		let exp = {};
		names.forEach( (n) => {
			exp[n] = document.querySelector("input[name=" + n + "]")?.value;
		});
		exp.img = this.state.dataUri;
		exp.username = username;
		this.db.addExp(exp);
		this.setState({snackbar: {open: true, message: "Experience added successfully!", severity: "success"}});
	}

	handleSnackbarClose() {
		this.setState({snackbar: {open: false, severity: this.state.snackbar.severity}});
	}

	render() {
		let snackbar = this.state.snackbar;
		return (
			<div className="NewExperience">
				<MySnackbar 
					open={snackbar.open} 
					onClose={this.handleSnackbarClose.bind(this)} 
					message={snackbar.message} 
					severity={snackbar.severity}
				/>
				<form>
					<h2>Add Experience</h2>
					<div className="NewExperience-flex">
						<label htmlFor="newExpImg">
							<img src={this.state.dataUri} alt="Upload picture"></img>	
						</label>		
						<input type="file" id="newExpImg" name="img" onChange={(e) => this.onChange(e.target.files[0])}></input>
						<input type="text" id="newExpName" name="name" placeholder="Name"></input>
						<input type="text" id="newExpCountry" name="country" placeholder="Country"></input>
						<input type="text" id="newExpCity" name="city" placeholder="City"></input>
						<textarea id="newExpDocumentation" name="documentation" placeholder="Documentation"></textarea>
						<input type="text" id="newExpBudget" name="budget" placeholder="Budget"></input>
						<textarea id="newExpTrasportation" name="transportation" placeholder="Trasnportation"></textarea>
						<textarea id="newExpAccomodation" name="accomodation" placeholder="Accomodation"></textarea>
						<textarea id="newExpUsefulLinks" name="usefulLinks" placeholder="Useful links"></textarea>
						<button className="button-primary" onClick={this.onSubmit.bind(this)}>Add experience</button>
					</div>
				</form>
			</div>
		);
	}
}

export default NewExperience

/*					<table>
						<tr>
							<td>
								<label for="newExpImg">Image</label>
							</td>
							<td>
								<input type="file" id="newExpImg" name="img" onChange={(e) => this.onChange(e.target.files[0])}></input>
							</td>
						</tr>
						<tr>
							<td>
								<label for="newExpName">Name</label>
							</td>
							<td>
								<input type="text" id="newExpName" name="name"></input>
							</td>
						</tr>
						<tr>
							<td>
								<label for="newExpCountry">Country</label>
							</td>
							<td>
								<input type="text" id="newExpCountry" name="country"></input>
							</td>
						</tr>
						<tr>
							<td>
								<label for="newExpCity">City</label>
							</td>
							<td>
								<input type="text" id="newExpCity" name="city"></input>
							</td>
						</tr>
						<tr>
							<td>
								<label for="newExpDocumentation">Documentation</label>
							</td>
							<td>
								<input type="text" id="newExpDocumentation" name="documentation"></input>
							</td>
						</tr>
						<tr>
							<td>
								<label for="newExpBudget">Budget</label>
							</td>
							<td>
								<input type="text" id="newExpBudget" name="budget"></input>
							</td>
						</tr>
						<tr>
							<td>
								<label for="newExpTrasportation">Trasportation</label>
							</td>
							<td>
								<input type="text" id="newExpTrasportation" name="transportation"></input>
							</td>
						</tr>
						<tr>
							<td>
								<label for="newExpAccomodation">Accomodation</label>
							</td>
							<td>
								<input type="text" id="newExpAccomodation" name="accomodation"></input>
							</td>
						</tr>
						<tr>
							<td>
								<label for="newExpUsefulLinks">Useful links</label>
							</td>
							<td>
								<input type="text" id="newExpUsefulLinks" name="usefulLinks"></input>
							</td>
						</tr>
					</table>*/