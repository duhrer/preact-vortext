import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Vortex from '../routes/vortex';

const App = () => (
	<div id="app">
		<Header />
		<Router>
			<Home path="/" />
			<Vortex path="/vortex" />
		</Router>
	</div>
)

export default App;
