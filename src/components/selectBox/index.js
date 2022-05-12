import {Component} from 'preact';

class SelectBox extends Component {
    renderOptions() {
        const options = [];

        const isNoneSelected = this.props.selectedOption === "none";
        options.push(<option value="none" id="none" selected={isNoneSelected}>No Device Selected</option>);

        // flocking-midi returns entries like this for each port:
        //
        // {
        //     id: "flock-no-port-selected",
        //     name: "None"
        // }
        if (Array.isArray(this.props.optionDefs)) {
            this.props.optionDefs.forEach((optionDef, index) => {
                const isSelected = this.props.selectedOption === optionDef.id;
                options.push(<option value={optionDef.id} id={index} selected={isSelected}>{optionDef.name || optionDef.id}</option>);
            });    
        }

        return(options);
    }

    render() {
        return (<div className='preact-vortex-select-panel'>
            <h4>{this.props.label}</h4>
            <select onChange={this.props.onChange}>
                {this.renderOptions()}
            </select>
        </div>);
    }
}

export default SelectBox;
