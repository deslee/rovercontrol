var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var BasicControl = require('../components/BasicControl');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			devices: [],
			connectInterval: undefined,
			connecting: false,
			connected: false
		}
	},
	componentWillMount: function() {
		var interval = setInterval(function() {
			// if you're not connected or connecting...
			if (!this.state.connected && !this.state.connecting) {
				// try to connect
				this.state.devices.forEach(function(d) {
					if (d.name == 'RN42-81D4') {
						this.connectToDevice(d.id);
					}
				}.bind(this))
			}
		}.bind(this), 100);
		this.setState({connectInterval: interval})
	},
	componentWillUnmount: function() {
		if(this.state.connectInterval)	
			clearInterval(this.state.connectInterval)
	},
	componentWillReceiveProps: function(nextProps) {
		var oldState = this.props.deviceState;
		var newState = nextProps.deviceState;
		if (!oldState.deviceReady && newState.deviceReady) {
			// device just turned ready
			bluetoothSerial.list(function(devices) {
				this.setState({devices: devices});

				devices.forEach(function(d) {
					if (d.name == 'RN42-81D4') {
						this.connectToDevice(d.id);
					}
				}.bind(this))
			}.bind(this));
		}
	},
	connectToDevice: function(id) {
		this.setState({connecting: true});
		bluetoothSerial.connect(id, function() {
			this.setState({connected: true});
		}.bind(this), function(err) {
			this.setState({connecting: false})
			console.log('fail', err);										 
		}.bind(this));
	},
	mixins: [ Router.State ],
	render: function() {
		var route = this.getRoutes();

		var list = (
		<ul>
			{this.state.devices.map(function(device) {
				return <li>{device.name}</li>															 
			})}
		</ul>
		)
		
		return (
			<div>
				<p>Devices:</p>
				<p>{this.state.connecting ? "Connecting..." : (this.state.connected ? "Connected!" : "Disconnected")}</p>
				<BasicControl deviceState={this.props.deviceState} />
			</div>
		);
	}
});
