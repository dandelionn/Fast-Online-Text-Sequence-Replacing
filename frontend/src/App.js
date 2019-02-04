import React, { Component } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Content from './containers/Content/Content';
import Languages from './Languages';

import axios from 'axios';

let baseURL = "https://www.theusefulweb.tk/";
if(window.location.href.startsWith("https://www.theusefulweb.tk/"))
    baseURL = "https://www.theusefulweb.tk/";
else if(window.location.href.startsWith("https://theusefulweb.tk/"))
    baseURL = "https://theusefulweb.tk/";
else baseURL = "http://localhost:3000/";


class App extends Component {
  state = {
    language: Languages['english'],
    processedFilesCount : 0
  }

  /*requestProcessedFilesCount = () => {
    let processedFilesCount = 0;
    axios.get(`${baseURL}processedFilesCount`)
    .then( (response) => {
                processedFilesCount = response.data;
                console.log(response);
    })
    .catch(errors => {
        console.log(errors);
    });
  
    return processedFilesCount;
  }

  componentDidMount(){
    this.setState({processedFilesCount: this.requestProcessedFilesCount()})
  }*/

  changeLanguageHandler = (e) => {
      this.setState({
          language: Languages[e.target.value],
      });
  }

  updateProcessedFilesCountHandler = (count) => {
      console.log("count", count);
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
