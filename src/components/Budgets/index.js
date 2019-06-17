import * as BudgetsActions from '../../actions/budgets';
import * as search from 'searchtabular';
import CreatePlan from './CreatePlan';
import Form from './Item/Form';
import List from './List';
import PresetBudgets from './PresetBudgets';
import React, { Component } from 'react';
import Table from './Table';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import { compose } from 'redux';
import { multiInfix } from '../../helpers/utils';
import { convertToList } from '../../helpers/reformat';

class Budgets extends Component {
  constructor(props) {
    super();

    this.state = {
      filter: {
        field: 'summary',
        value: '',
      },
      isCreatePlanExpanded: false,
      isFormExpanded: false,
      isSavedExpanded: false,
      isViewSwitcherExpanded: false,
    };

    this.filterItems = this.filterItems.bind(this);
    this.onAdd    = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEdit   = this.onEdit.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.search   = this.search.bind(this);
    this.toggleColumn = this.toggleColumn.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(BudgetsActions.subscribe());
  }

  filterItems(items, query) {
    const rows = this.props.itemArray;
    const columns = this.props.fields.map((field) => ({
      property: field.name,
      header: {
        label: field.label,
      },
      filterType:field.filterType,
    }));

    const searchExecutor = search.multipleColumns({
      columns,
      query,
      strategy: multiInfix });
    const visibleItems = compose(searchExecutor)(rows);

    return visibleItems;
  }

  onFilter({ field = this.state.filter.field, value = this.state.filter.value }) {
    this.setState({
      filter: {
        field,
        value,
      },
    });

    const newQuery = {
      ...this.props.query,
      [field]: value,
    };

    this.props.dispatch(BudgetsActions.search({ query: newQuery, visibleItems:this.filterItems(this.props.itemArray, newQuery) }));
  }

  onAdd(item) {
    this.props.dispatch(BudgetsActions.addItem({ item }));
  }

  onDelete(itemId) {
    this.props.dispatch(BudgetsActions.removeItem({ itemId }));
  }

  onEdit(updatedItem) {
    this.props.dispatch(BudgetsActions.updateItem({ updatedItem }));
  }

  renderList() {

     return (
       <List
         filter={this.state.filter}
         onDelete={this.onDelete}
         onEdit={this.onEdit}
         onFilter={this.onFilter}
       />
     );
   }

  renderTable() {
    return (
      <Table
        onDelete={this.onDelete}
        onEdit={this.onEdit}
        search={this.search}
        toggleColumn={this.toggleColumn}
      />
    );
  }

  search(query) {
    const visibleItems = this.filterItems(this.props.itemArray, query);
    this.props.dispatch(BudgetsActions.search({ query, visibleItems }));
  }

  toggleColumn(payload){
    this.props.dispatch(BudgetsActions.toggleColumn({ columnName: payload.columnName }));
  }

  render() {

    return (
      <div>
        <div className="panel-uc panel panel-default">
          <div className="panel-uc__heading panel-heading clearfix">
            <h4>Budget Tool</h4>
          </div>
          <div className="row panel-body">
            <div className="panel-body projects__wrapper">
              <button
                className="btn btn-default"
                onClick={() => this.setState({ isFormExpanded: !this.state.isFormExpanded })}
                type="button"
              >
                Add Items {' '}
                <span className="caret"></span>
              </button>
              {this.state.isFormExpanded && (
                <Form
                  onSubmit={this.onAdd}
                />
              )}
              <button
                type="button"
                className="btn btn-default"
                onClick={() => this.setState({ isViewSwitcherExpanded: !this.state.isViewSwitcherExpanded })}
              >
                Switch View {' '}
                <span className="caret"></span>
              </button>
              {this.state.isViewSwitcherExpanded && (
                <ul>
                  <li>
                    <Link to={this.props.match.url + '/list'}>List</Link>
                  </li>
                  <li>
                    <Link to={this.props.match.url + '/table'}>Table</Link>
                  </li>
                </ul>
              )}
              <button
                className="btn btn-default"
                onClick={() => this.setState({ isSavedExpanded: !this.state.isSavedExpanded })}
                type="button"
              >
                Saved Budgets {' '}
                <span className="caret"></span>
              </button>
              {this.state.isSavedExpanded && (
                <PresetBudgets
                  search={this.search}
                />
              )}
              <button
                className="btn btn-default"
                onClick={() => this.setState({ isCreatePlanExpanded: !this.state.isCreatePlanExpanded })}
                type="button"
              >
                Workplan {' '}
                <span className="caret"></span>
              </button>
              {this.state.isCreatePlanExpanded && (
                <CreatePlan />
              )}
              <Route
                exact path={this.props.match.url}
                render={this.renderTable}
              />
              <Route
                path={this.props.match.url + '/list'}
                render={this.renderList}
              />
              <Route
                path={this.props.match.url + '/table'}
                render={this.renderTable}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  itemArray: convertToList(state.budgets.itemList),
  fields: state.budgets.fields,
  query: state.budgets.query,
  userColumns: state.budgets.userColumns,
  visibleItems: convertToList(state.budgets.visibleItemList),
});

export default connect(mapStateToProps)(Budgets);
