/**
 * A React component composer function creator used to connect
 * Meteor reactive data to any React component
 * @param  {function} getMeteorData - a function that returns as object
 * with Meteor reactive data sources
 * @return {function} - a function used to wrap React components
 */
connectMeteorData = function(getMeteorData) {
  if (!getMeteorData || typeof getMeteorData !== 'function') {
    throw new Error('You need to supply a function returning an ' +
      'object of Meteor reactive data sources.');
  }

  /**
   * Returns wrapped component connected with Meteor reactive
   * data sources so that you don't have to access the data with
   * `this.data` but rather with `this.props`.
   * @param  {React.Component} WrappedComponent - A React component
   * @param  {object} optional - an object with acceptable context types
   * @return {React.Component} The resulting React component
   */
  return function wrapReactComponent(WrappedComponent, contextTypes = {}) {
    if (!WrappedComponent || !(WrappedComponent instanceof React.constructor)) {
      throw new Error('You must pass a React component into this function.');
    }

    return React.createClass({
      displayName: 'MeteorizedComponent',

      mixins: [ReactMeteorData],

      contextTypes: contextTypes,

      getMeteorData() {
        return getMeteorData.call(
          this,
          this.props,
          this.context);
      },

      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...this.data} />
        );
      }
    });
  };
};
