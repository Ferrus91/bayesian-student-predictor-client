import React, { Component } from 'react';
import {
  Button,
} from 'react-desktop/macOs';

import styles from './Home.css';
//Image in public domain https://commons.wikimedia.org/wiki/File:Thomas_Bayes.gif
import ThomasBayes from '../assets/ThomasBayes.gif'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.redirectToPredictor = this.redirectToPredictor.bind(this);
    this.redirectToDatabase = this.redirectToDatabase.bind(this);
  }
  
  redirectToPredictor() {
    this.props.history.replace('/predictor');
  }
  
  redirectToDatabase() {
    this.props.history.replace('/database');
  }
  
  render() {
    return (
      <div>
        <div className={styles.buttonBox}>
          <img src={ThomasBayes}/>
        </div>
        <h1 className={styles.titleText}>Bayesian Student Predictor</h1>
        <div className={styles.buttonBox}>
          <Button size={25} className={styles.homepageButton} color="black" onClick={this.redirectToPredictor}>
            Prediction
          </Button>
        </div>
        <div className={styles.buttonBox}>
          <Button size={25} className={styles.homepageButton} color="black"  onClick={this.redirectToDatabase}>
            Results Database
          </Button>
        </div>
      </div>
    )
  }
}