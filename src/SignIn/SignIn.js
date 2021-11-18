import React from 'react';
import MySnackbar from '../MySnackbar';
import '../common.css';
import './SignIn.css';

class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {snackbar: {open: false, severity: "info", message: ""}, isFormSignIn: true};
	}

	onSignupSubmit(e) {
		e.preventDefault();
		let names = ["username", "email", "password", "confirmPassword"];
		let user = {};
		names.forEach( (n) => {
			user[n] = document.querySelector(".SignIn input[name=" + n + "]")?.value;
		});
		let message;
		if ((message = this.props.db.signupUser(user)) === "") {
			this.openNavSnackbar("success", "Signup successful!");
			this.onFormSuccess();
		}
		else {
			this.setState({snackbar: {open: true, severity: "error", message: message}});
		}
	}

	onSignInSubmit(e) {
		e.preventDefault();
		let username, password = "";
		username = document.querySelector(".SignIn input[name=username]")?.value;
		password = document.querySelector(".SignIn input[name=password]")?.value;
		let user;
		if ((user = this.props.db.signInUser(username, password)) !== null) {
			this.openNavSnackbar("success", "Welcome back, " + user?.username + "!");
			this.onFormSuccess();
		}
		else {
			this.setState({snackbar: {open: true, severity: "error", message: "Sign in unsuccessful."}});
		}
	}

	onFormSuccess() {
		this.props.setNavState({isSignInOpen: false});
	}

	openNavSnackbar(severity, message) {
		this.props.setNavState({snackbar: {open: true, severity: severity, message: message}});
	}

	handleSnackbarClose() {
		this.setState({snackbar: {open: false, severity: this.state.snackbar.severity}});
	}

	genSwitchButton(text) {
		return (
			<button 
			className="button-switch-forms" 
			onClick={() => this.setState({isFormSignIn: !this.state.isFormSignIn})}
			>
				{text}
			</button>
		);
	}

  render() {
		const {snackbar} = this.state;
		let form;
		if (this.state.isFormSignIn === false) {
			form = (
				<div>
					<h2>Sign up</h2>
					<span className="under-headline">Save all your favorite experiences!</span>
					<form>
						<div className="SignIn-flex">
							<input name="username" placeholder="Username"/>
							<input name="email" placeholder="Email" />
							<input name="password" placeholder="Password" />
							<input name="confirmPassword" placeholder="Confirm password" />
							<button className="button-submit" onClick={this.onSignupSubmit.bind(this)}>Sign up</button>
						</div>
					</form>
					<span>Already have an account?{this.genSwitchButton("Sign in")}</span>
					<span className="disclaimer">By signing up you agree to our<br/>Terms {'&'} Conditions</span>	
				</div>
			);
		}
		else {
			form = (
				<div>
					<h2>Sign in</h2>
					<span className="under-headline">Save all your favorite experiences!</span>
					<form>
						<div className="SignIn-flex">
							<input name="username" placeholder="Username"/>
							<input name="password" placeholder="Password" />
							<button className="button-submit" onClick={this.onSignInSubmit.bind(this)}>Sign in</button>
						</div>
					</form>
					<span>Not registered yet?{this.genSwitchButton("Sign up")}</span>
				</div>
			);
		}
		return (
			<div className="SignIn">
				{form}
				<MySnackbar 
					open={snackbar.open} 
					onClose={this.handleSnackbarClose.bind(this)} 
					message={snackbar.message} 
					severity={snackbar.severity}
				/>
			</div>
		);
  }
}

/*


				<Snackbar 
					open={snackbar.open} 
					autoHideDuration={6000} 
					onClose={this.handleSnackbarClose.bind(this)}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
				>
					<Alert onClose={this.handleSnackbarClose.bind(this)} severity={snackbar.severity} sx={{ width: '100%' }}>
						{snackbar.message}
					</Alert>
				</Snackbar>

*/

export default SignIn;