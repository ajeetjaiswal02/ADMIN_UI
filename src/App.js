import './App.css';
import React  from 'react';
import Users from './components/Users';
import Header from './components/header';
import Footer from './components/footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Users />
      <Footer />
      
    </div>
  );
}

export default App;
