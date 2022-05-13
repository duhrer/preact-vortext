import {Component} from 'preact';

import Vortex from './vortex';
import MidiSelector from './midiSelector';


// TODO: Bridge to send selected devices to infusion component.

// TODO: react variables for noteInput, noteOutput, uiOutput

// TODO: Bridge to send colours back to the onscreen display

// TODO: Bridge to send pad events to infusion component.

class App extends Component {
	constructor (props) {
		super(props);

		if (window && window.fluid) {
			require("../fluid/sidecar");
			this.that = fluid.sidecar({
				modelListeners: {
					"*": {
						excludeSource: "init",
						func: this.handleModelChange,
						args: ["{change}.path", "{change}.value"] // path, newValue
					}
				}
			});

			// TODO: Remove
			window.sidecar = this.that;
        }
	}

	handleModelChange = (path, newValue) => {
		let newStateFragment = { path: newValue };
		this.setState(newStateFragment);
	}

	render() {
		return (<div id="app">
			<Vortex
				that={this.that}
			/>

			<MidiSelector
				that={this.that}
			/>
		</div>);
	}
}
export default App;
