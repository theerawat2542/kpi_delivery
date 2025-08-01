// App.jsx
import './App.css';
import Actual from './components/Actual';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Actual />
    </div>
  );
}

export default App;