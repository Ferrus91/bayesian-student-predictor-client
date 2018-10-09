import React, { Component } from 'react';
import styles from './Predictor.css';
import {
  Button,
} from 'react-desktop/macOs';
import axios from 'axios';
import PredictorModelInput from './PredictorModelInput';
import PredictorModelConfig from './config/PredictorModelConfig';
import { ipcRenderer } from 'electron';
import { DebounceInput } from 'react-debounce-input';

export default class Predictor extends Component {
  constructor (props) {
    super(props);
    this.redirectToHome = this.redirectToHome.bind(this);
    this.renderFeatures = this.renderFeatures.bind(this);
    this.handleFeatureChange = this.handleFeatureChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.predictSuccess = this.predictSuccess.bind(this);
    this.saveData = this.saveData.bind(this);
    this.state = {
      features: [],
      query: {},
      studentCode: '',
    }
  }
  
  componentWillMount() {
    axios.get('http://localhost:8080/api/v1/values')
    .then((response) => {
      const { data: { nodes } } = response;
      let features = [];
      nodes.forEach((node) => {
        if (node.name !== 'success') {
          features.push({
            key: node.name,
            name: PredictorModelConfig[node.name],
            outcome: node.outcomes,
          });
        }
      });
      this.setState({ features });
    })
    .catch((error) => {
      console.log(error);
    })
  }
  
  redirectToHome() {
    this.props.history.replace('/');
  }
  
  handleFeatureChange(key, value) {
    const query = Object.assign(this.state.query, {
      [key]: value,
    });
    this.setState({ query });
  }
  
  predictSuccess() {
    axios.post('http://localhost:8080/api/v1/query', this.state.query)
    .then((response) => {
      const { successProbability } = response.data;
      this.setState({ successProbability })
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  handleFeatureChange(key, value) {
    const query = Object.assign(this.state.query, {
      [key]: value,
    });
    this.setState({ query });
  }
  
  renderFeatures() {
    if (!this.state.features) return null;
    return this.state.features.map(feature => <PredictorModelInput
      key={feature.key}
      feature={feature}
      handleFeatureChange={this.handleFeatureChange}
    />)
  }
  
  handleCodeChange(e) {
    this.setState({ studentCode: e.target.value });
  }
  
  saveData() {
    return ipcRenderer.send('success-data', { 
      query: this.state.query, 
      success: this.state.successProbability >= 0.5,
      successProbability: this.state.successProbability,
      studentCode: this.state.studentCode,
    });
  }
  
  render() {
    return (
      <div className={styles.predictorBox}>
        {this.renderFeatures()}
        <div>
          <h1 className={styles.codeLabel}>Student Code:</h1>
          <DebounceInput
            className={styles.codeInput}
            type="text"
            value={this.state.code}
            onChange={this.handleCodeChange}
          />
        </div>
        <If condition={this.state.successProbability !== undefined}>
          <br/>
          <div className={styles.probabilityBox}>
            <h1 className={styles.probabilityLabel}>Probability of success: {this.state.successProbability}</h1>
            <h1 className={styles.probabilityLabel}>Predicted Success: {this.state.successProbability >= 0.5 ? 'SUCCESS' : 'FAIL'}</h1>
          </div>
          <div className={styles.buttonBox}>
            <Button size={25} className={styles.homepageButton} color="black"  onClick={this.saveData}>
              Save Data
            </Button>
          </div>
        </If>
        <div className={styles.buttonBox}>
          <Button size={25} className={styles.homepageButton} color="black"  onClick={this.predictSuccess}>
            Predict Success
          </Button>
        </div>
        <div className={styles.buttonBox}>
          <Button size={25} className={styles.homepageButton} color="black"  onClick={this.redirectToHome}>
            Back
          </Button>
        </div>
      </div>
    )
  }
}