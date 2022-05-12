if (window && window.fluid) {
    var fluid = window.fluid;
    // A UI-less wrapper around the core of flocking-midi.
    fluid.defaults("fluid.sidecar", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            selectedNoteInput: "none",
            selectedNoteOutput: "none",
            selectedUIOutput: "none",
            ports: {
                inputs: {},
                outputs: {}
            }
        },
        components: {
            midiSystem: {
                type: "flock.midi.system",
                options: {
                    model: {
                        ports: "{fluid.sidecar}.model.ports"
                    }
                }
            }
            // TODO: dynamic component for each input / output, gated by validation function.
        }
    });
    
    // TODO: Infusion component to manage connections
    // TODO: Bridge to send colours back to the onscreen display
    // TODO: Bridge to send pad events to infusion component.
}

