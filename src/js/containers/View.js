import { connect } from 'vuex-connect';
import ViewComponent from '../components/View';

export default connect({
  stateToProps: {
    item: state => state.item,
    loading: state => state.loading,
  },
  lifecycle: {
    beforeCreate({ state, dispatch }) {
      dispatch('get', state.route.params.id);
    },
  },
})(ViewComponent);