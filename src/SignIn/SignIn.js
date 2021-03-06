import React from 'react';
import '../common.css';
import './SignIn.css';
import withHooks from '../withHooks';

class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isFormSignIn: true};
	}

	checkFormValidity(formElement) {
		let inputs = formElement.querySelectorAll("input");
		console.log(inputs);
		for (let i = 0; i < inputs.length; i++) {
			const input = inputs[i];
			if (input.checkValidity() === false)
				return false;
		}
		return true;
	}

	onSignupSubmit(e) {
		e.preventDefault();
		if (!this.checkFormValidity(e.target)) {
			this.props.addSnackbar("error", "One or more inputs are invalid!");
			return;
		}
		let names = ["username", "email", "password", "confirmPassword"];
		let user = {};
		names.forEach( (n) => {
			user[n] = document.querySelector(".SignIn input[name=" + n + "]")?.value;
		});
		let message;
		if ((message = this.props.db.signupUser(user)) === "") {
			this.props.addSnackbar("success", "Sign up successfull!");
			this.onFormSuccess();
		}
		else {
			this.props.addSnackbar("error", message);
		}
	}

	onSignInSubmit(e) {
		e.preventDefault();
		if (!this.checkFormValidity(e.target)) {
			this.props.addSnackbar("error", "One or more inputs are invalid!");
			return;
		}
		let username, password = "";
		username = document.querySelector(".SignIn input[name=username]")?.value;
		password = document.querySelector(".SignIn input[name=password]")?.value;
		let user;
		if ((user = this.props.db.signInUser(username, password)) !== null) {
			this.props.addSnackbar("success", "Welcome back, " + user?.username + "!");
			this.onFormSuccess();
		}
		else {
			this.props.addSnackbar("error", "Sign in unsuccessful.");
		}
	}

	onFormSuccess() {
		this.props.setNavState({isSignInOpen: false});
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
		let form;
		if (this.state.isFormSignIn === false) {
			form = (
				<div>
					<h2>Sign up</h2>
					<span className="under-headline">Save all your favorite experiences!</span>
					<form onSubmit={this.onSignupSubmit.bind(this)}>
						<div className="flex">
							<label for="signupUsername">Username</label>
							<input id="signupUsername" name="username" placeholder="Username"/>
							<label for="signupEmail">Email</label>
							<input id="signupEmail" type="email" name="email" placeholder="Email" />
							<label for="signupPassword">Password</label>
							<input id="signupPassword" type="password" name="password" placeholder="Password (8+ characters)" pattern={this.props.db.passwordPattern}/>
							<label for="signupConfirmPassword">Confirm password</label>
							<input id="signupConfirmPassword" type="password" name="confirmPassword" placeholder="Confirm password" pattern={this.props.db.passwordPattern} />
							<button type="submit" className="button-submit">Sign up</button>
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
					<form onSubmit={this.onSignInSubmit.bind(this)}>
						<div className="flex">
							<label for="signinUsername">Username</label>
							<input id="signinUsername" name="username" placeholder="Username"/>
							<label for="signinPassword">Password</label>
							<input id="signinPassword" type="password" name="password" placeholder="Password" />
							<button type="submit" className="button-submit">Sign in</button>
						</div>
					</form>
					<span>Not registered yet?{this.genSwitchButton("Sign up")}</span>
				</div>
			);
		}
		return (
			<div className="SignIn form-dialog">
				{form}
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

export default withHooks(SignIn);