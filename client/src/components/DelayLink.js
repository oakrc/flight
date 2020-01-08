import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

class DelayLink extends React.Component {
  static propTypes = {
    delay:        PropTypes.number,
    onDelayStart: PropTypes.func,
    onDelayEnd:   PropTypes.func,
    history: PropTypes.object.isRequired
  };

  static defaultProps = {
    delay:        1000,
    onDelayStart: () => {},
    onDelayEnd:   () => {}
  };

  static contextTypes = Link.contextTypes;

  constructor(props) {
    super(props);
    this.timeout = null;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  /**
   * Called when the link is clicked
   *
   * @param {Event} e
   */
  handleClick = (e) => {
    const { replace, to, delay, onDelayStart, onDelayEnd } = this.props;

    onDelayStart(e, to);
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();

    this.timeout = setTimeout(() => {
      if (replace) {
        this.props.history.replace(to);
      } else {
        this.props.history.push(to);
      }
      onDelayEnd(e, to);
    }, delay);
  };

  render() {
    const props = Object.assign({}, this.props);
    delete props.delay;
    delete props.onDelayStart;
    delete props.onDelayEnd;

    return (
      <Link {...props} onClick={this.handleClick} />
    );
  }
}

export default withRouter(DelayLink);