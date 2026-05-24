import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import BookDetails from "./pages/BookDetails";
import { PreviouslyViewedProvider } from "./context/PreviouslyViewedProvider";

function App() {
	return (
		<PreviouslyViewedProvider>
			<div className="min-h-screen bg-surface text-text-primary">
				<Header />

				<main id="main-content" className="p-6">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/books/:id" element={<BookDetails />} />
					</Routes>
				</main>
			</div>
		</PreviouslyViewedProvider>
	);
}

export default App;
