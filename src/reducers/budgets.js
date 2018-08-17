import { ActionTypes } from '../config/constants';

const initialState = {
  itemList: {},
  fields: [
    {
      filterType: 'textfield',
      name: 'summary',
      label: 'Summary',
      type: 'text',
      required: true,
    },
    {
      filterType: 'textfield',
      name: 'phase',
      label: 'Phase',
      type: 'text',
      required: true,
    },
    {
      filterType: 'custom',
      name: 't&m',
      label: 'T&M',
      type: 'dropdown',
      options: [
        {
          name: 't&m',
          label: 'Fixed Fee',
          value: 'FALSE',
        },
        {
          name: 't&m',
          label: 'T&M',
          value: 'TRUE',
        },
      ],
    },
    {
      filterType: 'textfield',
      name: 'feature',
      label: 'Feature',
      type: 'text',
    },
    {
      filterType: 'textfield',
      name: 'budgetHours.column',
      label: 'Column',
      type: 'text',
    },
    {
      filterType: 'textfield',
      name: 'budgetHours.value',
      label: 'Hours',
      type: 'number',
    },
    {
      filterType: 'none',
      name: 'descriptions.workplan',
      label: 'Workplan description',
      type: 'text',
      required: true,
    },
    {
      filterType: 'none',
      name: 'descriptions.budget',
      label: 'Budget description',
      type: 'text',
    },
    {
      filterType: 'none',
      name: 'descriptions.assumptions',
      label: 'Assumptions',
      type: 'text',
    },
    {
      filterType: 'none',
      name: 'descriptions.clientResponsibilities',
      label: 'Client Responsibilities',
      type: 'text',
    },
    {
      filterType: 'none',
      name: 'descriptions.exclusions',
      label: 'Exclusions',
      type: 'text',
    },
    {
      filterType: 'custom',
      name: 'tags',
      label: 'Tags',
      required: true,
      type: 'text',
    },
    {
      filterType: 'none',
      isInteractive: true,
      name: 'edit',
      label: 'Edit',
    },
  ],
  query: {},
  userColumns: {
    summary: true,
    phase: false,
    feature: true,
    'budgetHours.column': false,
    'budgetHours.value': false,
    tags: true,
    edit: true,
  },
  visibleItemList: {},
  creatingPlan: {
    inProgress: false,
    response: null,
  },
  presets: {},
};

export default (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.BUDGETS_ADD:
      const payload = action.payload;
      return {
        ...state,
        [payload.elementType]: {
          ...state[payload.elementType],
          [payload.element.id]: payload.element,
        },
      };

    case ActionTypes.BUDGETS_REMOVE:
      delete state[action.payload.elementType][action.payload.elementId];

    case ActionTypes.BUDGETS_CREATE_PLAN:
      return {
        ...state,
        creatingPlan: {
          inProgress: true,
          response: null,
        }
      };

    case ActionTypes.BUDGETS_CREATE_PLAN_SUCCESS:
      return {
        ...state,
        creatingPlan: {
          inProgress: false,
          response: action.payload.result,
        }
      };
     
      return state;

    case ActionTypes.BUDGETS_SEARCH:
      const visibleItemList = {};
      action.payload.visibleItems.map((item) => {
          visibleItemList[item.id] = item;

          return item;
      });

      return {
        ...state,
        query: action.payload.query,
        visibleItemList,
      };

    case ActionTypes.BUDGETS_SUBSCRIBE:
      return state;

    case ActionTypes.BUDGETS_TOGGLE_COL:
      return {
        ...state,
        userColumns: {
          ...state.userColumns,
          [action.payload.columnName]: !state.userColumns[action.payload.columnName],
        }
      };

    case ActionTypes.BUDGETS_UPDATE:
      return {
        ...state,
        ...action.payload,
      };

    case ActionTypes.BUDGETS_UPDATE_ITEM:
      return {
        ...state,
        itemList: { 
          ...state.itemList,
          [action.payload.updatedItem.id]: action.payload.updatedItem,
        },
      };

    default:
      return state;
  }
};
