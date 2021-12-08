import React from "react";
import '../common.css';
import './NewCollection.css';
import '../NewExperience/NewExperience';
import withHooks from "../withHooks";

class NewCollection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {mainImg: ""};
		this.db = props.db;
	}
	
	onMainImgChange(src) {
		this.setState({mainImg: src});
	}

	onSubmit(e) {
		e.preventDefault();
		let username;
		if ((username = this.db.getCurrentUser().username) === "Guest") {
			this.props.addSnackbar("info", "You have to sign in to add experiences.");
			return;
		}
		let names = ["name", "img", "description"];
		let collection = {};
		names.forEach( (n) => {
			collection[n] = document.querySelector("input[name=" + n + "],textarea[name=" + n + "]")?.value;
		});
		collection.username = username;

		this.db.addCollection(collection);
		this.props.addSnackbar("success", "Experience added successfully");
	}

	render() {
		return (
			<div className="NewExperience NewCollection">
				<form onSubmit={e => this.onSubmit(e)}>
					<h2>Add Collection</h2>
					<div className="flex">
						<span>
							<img src={this.state.mainImg} alt="🖼"></img>
						</span>
						<label for="newCollectionImg">Main image</label>
						<input type="text" id="newCollectionImg" name="img" placeholder="Main image" onChange={(e) => this.onMainImgChange(e.target.value)}></input>
						<label for="newCollectionName">Name</label>
						<input type="text" id="newCollectionName" name="name" placeholder="Name"></input>
						<label for="newCollectionDescription">Description</label>
						<textarea type="text" id="newCollectionDescription" name="description" placeholder="Description"></textarea>
						<button className="button-primary">Add collection</button>
					</div>
				</form>
			</div>
		);
	}
}

export default withHooks(NewCollection);

/*

						<label htmlFor="newExpImg">
							<img src={this.state.dataUri} alt="Upload picture"></img>	
						</label>		
						<input type="file" id="newExpImg" name="img" onChange={(e) => this.onFileChange(e.target.files[0])}></input>
*/