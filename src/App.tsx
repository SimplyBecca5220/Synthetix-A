
import Header from './components/Header';
import MantlePulse from './components/MantlePulse';
import AgentLogic from './components/AgentLogic';
import PortfolioGraph from './components/PortfolioGraph';

function App() {
  return (
    <>
      <Header />
      <main className="layout-grid">
        <MantlePulse />
        <AgentLogic />
        <PortfolioGraph />
      </main>
    </>
  );
}

export default App;
