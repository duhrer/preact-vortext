import { h } from 'preact';
import style from './style.css';

const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p>A demonstration of preact and rapid state/prop changes.</p>
	</div>
);

export default Home;
