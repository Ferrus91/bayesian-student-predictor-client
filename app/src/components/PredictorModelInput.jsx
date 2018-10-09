import React, { Component } from 'react';
import Select from 'react-select';

import styles from './PredictorModelInput.css';

export default class Predictor extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedOption: props.feature && props.feature.outcome && props.feature.outcome[0],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange (selectedOption) {
    this.setState({ selectedOption });
    this.props.handleFeatureChange(this.props.feature.key, selectedOption.value);
  }
  
  render() {
    const options = this.props.feature.outcome.map(outcomeEntry => ({ 
      value: outcomeEntry,
      label: outcomeEntry,
    }));
    options.push({
      value: null,
      label: 'No data',
    })
    return ( 
      <div className={styles.predictorInput} >
        <h1 className={styles.predictorLabel}>{this.props.feature.name}</h1>
        <Select
          value={this.state.selectedOption}
          onChange={this.handleChange}
          options={options}
        />
      </div>
    )
  }
}