/* globals window */
import {Component} from 'preact';

import SelectBox from '../selectBox/';


// A panel of selectBox components wired to a sidecar Infusion component.
class MidiSelector extends Component {
	handleModelChange(path, newValue) {
		this.props.that.applier.change(path, newValue);
	}

	handleNoteInputChange = (event) => {
		this.handleModelChange("selectedNoteInput", event && event.target && event.target.value);
	}

	handleNoteOutputChange = (event) => {
		this.handleModelChange("selectedNoteOutput", event && event.target && event.target.value);
	}

	handleUIOutputChange = (event) => {
		this.handleModelChange("selectedUIOutput", event && event.target && event.target.value);
	}

    render() {
        return (<div className='preact-vortex-select-panel'>
            <SelectBox
                label="Note Input"
                selectedOption={this.props.that.model.selectedNoteInput}
                optionDefs={this.props.that.model.ports.inputs}
                onChange={this.handleNoteInputChange}
            />
            <SelectBox
                label="Note Output"
                selectedOption={this.props.that.model.selectedNoteOutput}
                optionDefs={this.props.that.model.ports.outputs}
                onChange={this.handleNoteOutputChange}
            />
            <SelectBox
                label="UI Output"
                selectedOption={this.props.that.model.selectedUIOutput}
                optionDefs={this.props.that.model.ports.inputs}
                onChange={this.handleUIOutputChange}
            />
        </div>);
    }
}



export default MidiSelector;