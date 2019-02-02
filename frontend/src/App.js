import React, { Component } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Content from './containers/Content/Content';
import Languages from './Languages';

class App extends Component {
  state = {
    language: Languages['english'],
    processedFilesCount : 0
  }

  changeLanguageHandler = (e) => {
      this.setState({
          language: Languages[e.target.value],
      });
  }

  updateProcessedFilesCountHandler = (count) => {
      this.setState({processedFilesCount: count});
  }

  render() {
    return (
      <div className="App">
        <Header language={this.state.language}/>
        <Content  updateProcessedFilesCount={(count) => this.updateProcessedFilesCountHandler(count)}
                language={this.state.language}/>
        <Footer processedFilesCount = {this.state.processedFilesCount}
                changeLanguage={this.changeLanguageHandler} 
                language={this.state.language}
        />
      </div>
    );
  }
}

export default App;
