import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import BookDetails from "./pages/BookDetails";

function App() {
	return (
		<div className="min-h-screen bg-surface text-text-primary">
			<Header />

			<div className="p-6">
				<Routes>
					<Route path={"/"} element={<Home></Home>} />
					<Route path="/books/:id" element={<BookDetails></BookDetails>} />
				</Routes>
			</div>
		</div>
	);
}

export default App;
