import './App.css';
import { QueryClientProvider } from './Kontekstid/QueryClientProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Esileht } from './Vaated/Esileht';

const App = () => {
	return (
		<QueryClientProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Esileht />} />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
