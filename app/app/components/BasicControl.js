var React = require('react/addons');

module.exports = React.createClass({
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

		var startInterval;

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

			if (command == this.state.lastCommand) return;
			console.log(command);
			if (typeof bluetoothSerial != 'undefined') {
				bluetoothSerial.write('s.', function() {
					bluetoothSerial.write(command, this.writeSuccess.bind(this, command));
				});
			}
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
		var lastCommand = this.state.lastCommand;
		return (
			<div>
				<p>Last command sent: {lastCommand}</p>
				<div className="controller" id="controller" ref="controller">
				</div>
			</div>
		);
	}
});
