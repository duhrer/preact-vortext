import {Component} from 'preact';

import style from './style.css';

class Cell extends Component {
    render () {
        const energyAsSaturation = this.props.cell * 255;
        let backgroundStyle = `background-color: rgb(${energyAsSaturation}, ${energyAsSaturation}, ${energyAsSaturation})`;
        return (
            <div
                class={style.cell}
                style={backgroundStyle}
                cell={this.props.cell}
                onMouseEnter={(event) => { this.handleMouseEnter(event); }}
            />
        );
    }

    handleMouseEnter = () => {
        this.props.addBall(this.props.row, this.props.col);
    }
}


class Row extends Component {
    buildCols() {
        let cells = [];
        this.props.cells.forEach((cell, col) => {
            cells.push(<Cell addBall={this.props.addBall} cell={cell} row={this.props.row} col={col} key={col} />)
        });

        return cells;
    }
    render() {
        return (<div class={style.row}>
            {this.buildCols()}
        </div>)
    }
}

class Vortex extends Component {
    state = {
        interval: false,
        balls: [],
        grid: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    }

    buildRows() {
        let rows = [];
        this.state.grid.forEach((cells, row) => {
            rows.push(<Row addBall={this.addBall} row={row} cells={cells} key={row} />)
        });
        return rows;
    }

    render() {
        return (
            <div class={style.grid}>
                {this.buildRows()}
            </div>
        )
    }

    componentWillMount() {
        let interval = setInterval(() => {
            this.updateSimulation(this);
        }, 25);
        this.state = { interval};

    }

    componentWillUnmount() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }
    }

    addBall = (row, col) => {
        let xOffsetFromCentre = col - 5;
        let yOffsetFromCentre = row - 5;
        let radius = Math.sqrt((xOffsetFromCentre * xOffsetFromCentre) + (yOffsetFromCentre * yOffsetFromCentre));
        let angleRadians = Math.atan2(yOffsetFromCentre, xOffsetFromCentre);
        let angleDegrees = (360 + (angleRadians * 180 / Math.PI)) % 360;
        
        let updatedBalls = this.state.balls.concat([{ angle: angleDegrees, radius, energy: 1}]);
        this.setState({ balls: updatedBalls});
    }

    updateSimulation() {
        const updatedBalls = [];
        for (let a = 0; a < this.state.balls.length; a++) {
            let ball = this.state.balls[a];
            let newRadius = ball.radius -= 0.05;
            if (newRadius > 0) {
                let newAngle = (ball.angle + 5) % 360;
                let newEnergy = ball.energy - 0.01
                updatedBalls.push({ angle: newAngle, radius: newRadius, energy: newEnergy});
            }
        }

        // updatedBalls.push({ angle: (Math.random() * 90), radius: 5, energy: 1 });

        const updatedGrid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        for (let ballNum = 0; ballNum < this.state.balls.length; ballNum++) {
            let ball = this.state.balls[ballNum];

            const radians = ball.angle * Math.PI / 180;
            const col = 5 + (Math.cos(radians) * ball.radius);
            const trailingCol = Math.trunc(col);
            const trailingColEnergyPercent = (col % 1);
            const leadingCol = trailingCol + 1;
            const leadingColEnergyPercent = 1 - trailingColEnergyPercent;

            const row = 5 + (Math.sin(radians) * ball.radius);
            const trailingRow = Math.trunc(row);
            const trailingRowEnergyPercent = (row % 1);
            const leadingRow = trailingRow + 1;
            const leadingRowEnergyPercent = 1 - trailingRowEnergyPercent;

            if (trailingRow >=0 && trailingRow < 10) {
                if (trailingCol >= 0 && trailingCol < 10) {
                    updatedGrid[trailingRow][trailingCol] = ball.energy * trailingRowEnergyPercent * trailingColEnergyPercent;
                }

                if (leadingCol >= 0 && leadingCol < 10) {
                    updatedGrid[trailingRow][leadingCol] = ball.energy * trailingRowEnergyPercent * leadingColEnergyPercent;    
                }    

            }
            if (leadingRow >=0 && leadingRow < 10) {
                if (trailingCol >= 0 && trailingCol < 10) {
                    updatedGrid[leadingRow][trailingCol] = ball.energy * leadingRowEnergyPercent * trailingColEnergyPercent;
                }

                if (leadingCol >= 0 && leadingCol < 10) {
                    updatedGrid[leadingRow][leadingCol] = ball.energy * leadingRowEnergyPercent * leadingColEnergyPercent;    
                }    
            }

        }

        this.setState({
            balls: updatedBalls,
            grid: updatedGrid
        });
    }
}

export default Vortex;