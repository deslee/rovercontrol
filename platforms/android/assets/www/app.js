(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react/addons');

module.exports = React.createClass({displayName: "exports",
	writeSuccess: function(cmd) {
		console.log(arguments);
		this.setState({lastCommand: cmd});
	},
	getInitialState: function() {
		return {
			lastCommand: 'n.a'
		}
	},
	componentDidMount: function() {

		var	container = this.refs.controller.getDOMNode()
		console.log(container);
		var joystick	= new VirtualJoystick({
			mouseSupport	: true,
			limitStickTravel: true,
			stickRadius	: 100,
		});

		var startInterval, oldCommand;
		var command = function() {
			var command = "";

			if(joystick.up()) {
				command += 'f';
			}
			else if(joystick.down()) {
				command += 'b';
			}
			else {
				command += 't';
			}
			if(joystick.left()) {
				command += 'l';
			}
			if(joystick.right()) {
				command += 'r';
			}

			if (!joystick.up() && !joystick.down() && !joystick.left() && !joystick.right()) {
				command = 's';
			}

			command += '.';

			if (command == oldCommand) return;
			console.log(command);
			if (typeof bluetoothSerial != 'undefined') {
				bluetoothSerial.write(command, this.writeSuccess.bind(this, command));
			}
			oldCommand = command;
		}.bind(this);
		
		joystick.addEventListener('touchEnd', function(){
			if (startInterval) {
				clearInterval(startInterval);
				if (typeof bluetoothSerial != 'undefined')
					bluetoothSerial.write('s.', this.writeSuccess.bind(this, 's.'));
			}
		}.bind(this));

		joystick.addEventListener('touchStart', function(){
			startInterval = setInterval(command, 100);
		});

		console.log(joystick);
		this.setState({joystick: joystick});
	},
	componentWillUnmount: function() {
		if (this.state.joystick) {
			
		}
	},
	render: function() {
		console.log(this.state)
		var lastCommand = this.state.lastCommand;
		return (
			React.createElement("div", null, 
				React.createElement("p", null, "Last command sent: ", lastCommand), 
				React.createElement("div", {className: "controller", id: "controller", ref: "controller"}
				)
			)
		);
	}
});


},{"react/addons":"yutbdK"}],2:[function(require,module,exports){
console.log("main js file");



var React = require('react/addons');
var Router = require('react-router');

var Route = Router.Route;
var Link = Router.Link;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var RootRouteHandler = require('./routes/RootRouteHandler')
var HomeRoute = require('./routes/HomeRouteHandler');
var NotFoundRouteHandler = require('./routes/NotFoundRouteHandler');


/* deslight require hook - do not modify this line */

var routes = (
	React.createElement(Route, {handler: RootRouteHandler, path: "/"}, 
		React.createElement(DefaultRoute, {handler: HomeRoute}), 
		React.createElement(NotFoundRoute, {handler: NotFoundRouteHandler}), 
"/* deslight route hook - do not modify this line */"
	)
);

Router.run(routes, function(Handler) {
	React.render(React.createElement(Handler, null), document.getElementById('root_btserialrover'));
});




},{"./routes/HomeRouteHandler":3,"./routes/NotFoundRouteHandler":4,"./routes/RootRouteHandler":5,"react-router":"vYZgCY","react/addons":"yutbdK"}],3:[function(require,module,exports){
var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var BasicControl = require('../components/BasicControl');

module.exports = React.createClass({displayName: "exports",
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
		React.createElement("ul", null, 
			this.state.devices.map(function(device) {
				return React.createElement("li", null, device.name)															 
			})
		)
		)
		
		return (
			React.createElement("div", null, 
				React.createElement("p", null, "Devices:"), 
				list, 

				React.createElement("p", null, "Connecting: ", this.state.connecting ? "yes" : "no"), 
				React.createElement("p", null, "Connected: ", this.state.connected ? "yes" : "no"), 

				React.createElement(BasicControl, {deviceState: this.props.deviceState})
			)
		);
	}
});


},{"../components/BasicControl":1,"react-router":"vYZgCY","react/addons":"yutbdK"}],4:[function(require,module,exports){
var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({displayName: "exports",
	mixins: [ Router.State ],
	render: function() {
		var route = this.getRoutes();
		
		return (
			React.createElement("div", null, 
				React.createElement("h2", null, "Not found")
			)
		);
	}
});


},{"react-router":"vYZgCY","react/addons":"yutbdK"}],5:[function(require,module,exports){
var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

module.exports = React.createClass({displayName: "exports",
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
			React.createElement("div", null, 
				React.createElement("header", null, React.createElement("h1", null, route)), 
				React.createElement("main", null, 
					React.createElement(RouteHandler, {deviceState: this.state})
				)
			)
		);
	}
});


},{"react-router":"vYZgCY","react/addons":"yutbdK"}]},{},[2])