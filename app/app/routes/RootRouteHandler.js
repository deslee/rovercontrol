var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({
	componentWillMount: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		this.setState({deviceReady: true});
	},
	getInitialState: function() {
		return {
		}
	},
	mixins: [ Router.State ],
	render: function() {
		var route = this.getParams();
		
		return (
			<div>
				<header><h1>{route}</h1></header>
				<main>
					<RouteHandler deviceState={this.state} />
				</main>
			</div>
		);
	}
});
