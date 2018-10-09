import React, { Component } from 'react';
import {
  Button,
} from 'react-desktop/macOs';
import { ipcRenderer } from 'electron';
import ReactDataGrid from 'react-data-grid';
const jsonexport = require("jsonexport/dist")

import PredictorModelConfig from './config/PredictorModelConfig';

import styles from './Database.css';

export default class Database extends Component {
  constructor(props) {
    super(props);
    this.redirectToHome = this.redirectToHome.bind(this);
    this.entryFetcher = this.entryFetcher.bind(this);
    this.downloadAsJSON = this.downloadAsJSON.bind(this);
    this.columns = [
      { key: 'success', name: 'Success'},
      { key: 'successProbability', name: 'Success Probability'},
      { key: 'studentCode', name: 'Student Code' },
    ];
    this.columns = this.columns.concat(Object.entries(PredictorModelConfig).map(([key, name]) => {
      return { key, name };
    }));
    this.state = {
      entries: [],
    }
  }
  
  componentWillMount() {
    ipcRenderer.on('receive-database-entries', (sender, { entries }) => {
      this.setState({ entries });
    })
    return ipcRenderer.send('request-database-entries');
  }
  
  downloadAsJSON() {
    const entries = this.state.entries.map(entry => {
      entry.actualSuccess = '<<DEFINE HERE>>';
      return entry;
    });
    jsonexport(entries, function(err, csv) {
        if(err) return console.log(err);
        const link = document.createElement('a');
        link.download = 'results.csv';
        link.href = `data:text/plain;base64,${window.btoa(csv)}`;
        link.dispatchEvent(new MouseEvent('click'));
    });
  }
  
  redirectToHome() {
    this.props.history.replace('/');
  }
  
  entryFetcher (index) {
    return this.state.entries[index];
  }

  render() {
    return (
      <div className={styles.dataBoxContainer}>
        <div className={styles.dataGrid}>
          <ReactDataGrid
            columns={this.columns}
            rowGetter={this.entryFetcher}
            rowsCount={this.state.entries.length}
            minHeight={100} 
            minWidth={1000}
          />);
          <div className={styles.buttonsBox}>
            <Button size={25} className={styles.homepageButton} color="black"  onClick={this.downloadAsJSON}>
              Download As JSON
            </Button>
            <br/>
            <Button size={25} className={styles.homepageButton} color="black"  onClick={this.redirectToHome}>
              Back
            </Button>
          </div>
        </div>
      </div>
    )
  }
}