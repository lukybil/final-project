import {Snackbar, Alert} from '@mui/material';
import React from 'react';

/* Example use
<MySnackbar 
	open={snackbar.open} 
	onClose={this.handleSnackbarClose.bind(this)} 
	message={snackbar.message} 
	severity={snackbar.severity}
/>
*/

class MySnackbar extends React.Component {
	render() {
		return (
			<Snackbar 
				open={this.props.open} 
				autoHideDuration={6000} 
				onClose={this.props.onClose}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert onClose={this.props.onClose} severity={this.props.severity} sx={{ width: '100%' }}>
					{this.props.message}
				</Alert>
			</Snackbar>
		);
	}
}

export class QuickMySnackbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {open: this.props.open};
	}
	render() {
		return (
			<Snackbar 
				open={this.state.open} 
				autoHideDuration={6000} 
				onClose={(e) => this.setState({open: false})}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert onClose={(e) => this.setState({open: false})} severity={this.props.severity} sx={{ width: '100%' }}>
					{this.props.message}
				</Alert>
			</Snackbar>
		);
	}
}

export default MySnackbar;