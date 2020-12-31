// Reference:
// https://medium.com/stashaway-engineering/react-redux-tips-better-way-to-handle-loading-flags-in-your-reducers-afda42a804c6

import ActionTypes, { requestStates } from '../helpers';

// Initialize state to hold all successes (so state doesn't need to be "seeded" to reference request key type)
const startLoading = [ActionTypes.AUTH_USER];

const initialState = {
  current: '',
  ...Object.values(ActionTypes)
    .reduce((accum, type) => ({
      ...accum,
      [type]: { loading: false, message: '', code: 200 },
    }), {}),
  ...startLoading
    .reduce((accum, type) => ({
      ...accum,
      [type]: { loading: true, message: '', code: null },
    }), []),
};

const reducer = (state = initialState, action) => {
  // Clear current error message
  if (action.type === ActionTypes.CLEAR_CURRENT) {
    return { ...state, current: '' };
  }

  /**
   * Check if the action name ends in "REQUEST", "SUCCESS", "FAILURE", or "CLEAR_ERR"
   */
  const matches = new RegExp(`(.*)_(${requestStates.REQUEST}|${requestStates.SUCCESS}|${requestStates.FAILURE}|${requestStates.CLEAR_ERR})`).exec(action.type);

  /**
   * The passed action name does not end in "REQUEST", "SUCCESS", "FAILURE", or "CLEAR_ERR"
   */
  if (!matches) { return state; }

  /**
   * There will only be three values within a valid matches array
   * 1) Full action name
   * 2) Action name
   * 3) Matched string within action ("REQUEST", "SUCCESS", "FAILURE", "CLEAR_ERR")
   */
  const [, requestName, requestState] = matches;

  /**
   * Keeps track of whether or not the requestName is associated with a request or a response
   * Will assign true to the value of requestName within the loadingReducer if the request has not completed,
   * and false if the request completes. This allows you to check loading through the loadingReducer automatically   *
   */
  const updatedState = { ...state, [requestName]: {} };
  updatedState[requestName].loading = requestState === requestStates.REQUEST && requestState !== requestStates.CLEAR_ERR;
  updatedState[requestName].message = requestState === requestStates.REQUEST ? '' : action?.payload?.message || '';
  updatedState[requestName].code = action?.payload?.code || null;

  // Pushes error notification to current
  if (requestState === requestStates.FAILURE) { updatedState.current = action?.payload?.message || ''; }

  return updatedState;
};

export default reducer;
