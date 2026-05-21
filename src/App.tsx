import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Header from "./components/Header";

function App() {
	return (
		<div className="min-h-screen bg-surface text-text-primary p-1">
			<Header />

			<Routes>
				<Route path={"/"} element={<Home></Home>} />
				<Route path="/books/:id" element={<Books></Books>} />
			</Routes>
		</div>
	);
}

export default App;
