if (window && window.fluid) {
    var fluid = window.fluid;

    fluid.defaults("fluid.midi.portConnector", {
        gradeNames: ["fluid.modelComponent"],
        type: "input",
        events: {
            attemptConnection: null,

            // We have the same events as our connection so that we can act as a proxy for it.
            aftertouch: null,
            control: null,
            message: null,
            note: null,
            noteOff: null,
            noteOn: null,
            pitchbend: null,
            program: null,
            raw: null
        },
        model: {
            selectedPort: "none",
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
                        ports: "{fluid.midi.portConnector}.model.ports"
                    }
                }
            },
            connection: {
                createOnEvent: "attemptConnection",
                type: "flock.midi.connection",
                options: {
                    events: {
                        aftertouch: "{fluid.midi.portConnector}.events.aftertouch",
                        control: "{fluid.midi.portConnector}.events.control",
                        message: "{fluid.midi.portConnector}.events.message",
                        note: "{fluid.midi.portConnector}.events.note",
                        noteOff: "{fluid.midi.portConnector}.events.noteOff",
                        noteOn: "{fluid.midi.portConnector}.events.noteOn",
                        pitchbend: "{fluid.midi.portConnector}.events.pitchbend",
                        program: "{fluid.midi.portConnector}.events.program",
                        raw: "{fluid.midi.portConnector}.events.raw"
                    },

                    openImmediately: true,
                    ports: "{arguments}.0"              
                }
            }
        },
        invokers: {
            send: {
                funcName: "fluid.midi.portConnector.send",
                args: ["{that}", "{arguments}.0"]
            }

        },
        modelListeners: {
            "selectedPort": {
                funcName: "fluid.midi.portConnector.attemptConnection",
                args: ["{that}"]
            }
        }
    });

    fluid.midi.portConnector.send = function (that, midiMessage) {
        if (that.connection) {
            that.connection.send(midiMessage);
        }
    };

    fluid.midi.portConnector.attemptConnection = function (that) {
        var singularDirection = that.options.type === "output" ? "output" : "input";
        var pluralDirection = singularDirection + "s";

        var selectedPort = fluid.find(fluid.get(that, ["model", "ports", pluralDirection]), function (singlePort) {
            return fluid.get(singlePort, "id") === that.model.selectedPort ? singlePort : undefined;
        });

        /*
            inputs: Array(5)
            0: MIDIInput {onmidimessage: null, connection: 'closed', id: '-1533143247', manufacturer: 'Focusrite', name: 'Scarlett 8i6 USB', …}
            1: MIDIInput {onmidimessage: null, connection: 'closed', id: '-1277114435', manufacturer: 'Apple Inc.', name: 'IAC Driver Bus 1', …}
            2: MIDIInput {onmidimessage: null, connection: 'closed', id: '-585363420', manufacturer: 'Focusrite A.E. Ltd', name: 'Launchpad Pro 7 Live Port', …}
            3: MIDIInput {onmidimessage: null, connection: 'closed', id: '-1409309741', manufacturer: 'Focusrite A.E. Ltd', name: 'Launchpad Pro 7 Standalone Port', …}
            4: MIDIInput {onmidimessage: null, connection: 'closed', id: '-305732042', manufacturer: 'Focusrite A.E. Ltd', name: 'Launchpad Pro 7 MIDI Port', …}
        */

        if (selectedPort) {
            // Fire the connection creation event with a "portSpec". Supported PortSpec formats:
            //  - Number: the index of the input and output port to use (this is the default)
            //  - { manufacturer: "akai", name: "LPD8"}
            //  - { input: Number, output: Number}
            //  - { input: { manufacturer: "akai", name: "LPD8"}, output: {manufacturer: "korg", name: "output"}}
            var portSpec = {};
            fluid.set(portSpec, [singularDirection], selectedPort);

            that.events.attemptConnection.fire(portSpec);
        }
    };

    // Among other things, a UI-less wrapper around the core of flocking-midi.
    fluid.defaults("fluid.sidecar", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            ports: { inputs: {}, outputs: {} },
            selectedNoteInput: "none",
            selectedNoteOutput: "none",
            selectedUIOutput: "none"
        },
        components: {
            noteInput: {
                type: "fluid.midi.portConnector",
                options: {
                    model: {
                        ports: "{fluid.sidecar}.model.ports",
                        selectedPort: "{fluid.sidecar}.model.selectedNoteInput"
                    },
                    listeners: {
                        "aftertouch": {
                            func: "{noteOutput}.send",
                            args: ["{arguments}.0"] // midiMessage
                        },
                        "note": {
                            func: "{noteOutput}.send",
                            args: ["{arguments}.0"] // midiMessage
                        }
                    }
                }
            },

            noteOutput: {
                type: "fluid.midi.portConnector",
                options: {
                    type: "output",
                    model: {
                        ports: "{fluid.sidecar}.model.ports",
                        selectedPort: "{fluid.sidecar}.model.selectedNoteOutput"
                    }
                }
            },

            uiOutput: {
                type: "fluid.midi.portConnector",
                options: {
                    type: "output",
                    model: {
                        ports: "{fluid.sidecar}.model.ports",
                        selectedPort: "{fluid.sidecar}.model.selectedUIOutput"
                    }
                }
            }

            // TODO: Bergson timing
            // TODO: add "balls" for note inputs.
            // TODO: add "balls" for pad inputs.
        }
    });
    
    // TODO: Infusion component to manage connections
    // TODO: Bridge to send colours back to the onscreen display
    // TODO: Bridge to send pad events to infusion component.
}

