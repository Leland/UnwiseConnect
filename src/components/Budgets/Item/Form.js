import flatten from 'flat';
import nanoid from 'nanoid';
import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: {
        ...flatten({ ...props.item }, { maxDepth: 2 }),
      },   
    }; 

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeDropdown = this.onChangeDropdown.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onCancel() {
    this.props.onSubmit(this.props.item);
  }

  onChange(name, value) {
    this.setState({ 
      item: {
        ...this.state.item,
        [name]: value,
      },
    });
  }

  onChangeDropdown(field) {
    this.onChange(field.name, field.value);
  }
  
  onSubmit(event) {
    event.preventDefault();

    // Unflatten
    this.props.onSubmit(flatten.unflatten({ ...this.state.item }));
    
    this.setState({ 
      isEditing: Form.defaultProps.isEditing, 
      item: {
        ...this.props.item,
        id: nanoid(),
      }, 
    });

    // Focus on the first input
    this.refs[this.props.fields[0].name].focus();
  }

  inputFormat(field){
    if (field.type === 'dropdown') {
      return(
        <Select 
          name={field.name}
          onChange={this.onChangeDropdown}
          options={field.options}
          value={this.state.item[field.name]}
        />
      );
    }
    if(field.name.indexOf('descriptions.') > -1) {
      return (
        <textarea 
          style={
            { 
              minHeight: '5em',
            }
          }
          className="form-control"
          ref={field.name}
          onChange={e => this.onChange(field.name, e.target.value)}
          required={field.required}
          type={field.type}
          value={this.state.item[field.name]}
        />
      );
    }
    return (
      <input 
        className="form-control"
        onChange={e => this.onChange(field.name, e.target.value)}
        ref={field.name}
        required={field.required}
        type={field.type}
        value={this.state.item[field.name]}
      />
    );
  }

  render() {
    const { fields } = this.props;
    const submitBtnLabel = this.props.isEditing ? 'Save Edit' : 'Add Item';

    return (
      <div>
        <form 
          onSubmit={this.onSubmit}
          style={{maxWidth: '500px'}}
        >
          <div>
            {fields.map((field) => (
              !field.isInteractive && (
                <div
                  className="form-group"
                  key={field.name}
                >
                  <label htmlFor={field.name}>{field.label}</label>
                  {this.inputFormat(field)}
                </div>
              )
            ))}
						<button type="submit" className="btn btn-primary" style={{gridColumn: '1 / -1'}}>{submitBtnLabel}</button>
            {this.props.isEditing && (
              <button onClick={this.onCancel} className="btn btn-primary">Cancel</button>
            )}
          </div>
        </form>
      </div>
    )
  }
}

Form.defaultProps = {
  item: {
    id: nanoid(),
    summary:  "",
    phase:    "",
    feature:  "",
    budgetHours: { 
      column: "",
      value: 0,
    },
    descriptions: {
      workplan: [],
      budget: [],
      assumptions: [],
      exclusions: [],
    },
    tags: "",

    'budgetHours.column': "",
    'budgetHours.value': 0,
    'descriptions.workplan': [],
    'descriptions.budget': [],
    'descriptions.clientResponsibilities': [],
    'descriptions.assumptions': [],
    'descriptions.exclusions': [],  
  },
  isEditing: false,
};

const mapStateToProps = state => ({
  fields: state.budgets.fields,
});

export default connect(mapStateToProps)(Form);
