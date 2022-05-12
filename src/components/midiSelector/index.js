/* globals window */
import {Component} from 'preact';

import SelectBox from '../selectBox/';


// A panel of selectBox components wired to a sidecar Infusion component.
class MidiSelector extends Component {
	handleModelChange(path, newValue) {
		this.props.that.applier.change(path, newValue);
	}

	handleNoteInputChange = (newValue) => {
		this.handleModelChange("selectedNoteInput", newValue);
	}

	handleNoteOutputChange = (newValue) => {
		this.handleModelChange("selectedNoteOutput", newValue);
	}

	handleUIOutputChange = (newValue) => {
		this.handleModelChange("selectedUIOutput", newValue);
	}

    render() {
        return (<div className='preact-vortex-select-panel'>
            <SelectBox
                label="Note Input"
                selectedOption={this.props.that.model.selectedNoteInput}
                optionDefs={this.props.that.model.ports.inputs}
                onchange={this.handleNoteInputChange}
            />
            <SelectBox
                label="Note Output"
                selectedOption={this.props.that.model.selectedNoteOutput}
                optionDefs={this.props.that.model.ports.outputs}
                onchange={this.handleNoteOutputChange}
            />
            <SelectBox
                label="UI Output"
                selectedOption={this.props.that.model.selectedUIOutput}
                optionDefs={this.props.that.model.ports.inputs}
                onchange={this.handleUIOutputChange}
            />
        </div>);
    }
}



export default MidiSelector;