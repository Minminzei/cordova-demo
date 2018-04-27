import { connect } from 'vuex-connect';
import ListComponent from '../components/List';
import { routes } from '../libs/router';

export default connect({
  stateToProps: {
    items: state => state.items,
    loading: state => state.loading,
  },
  methodsToEvents: {
    onClickView(vue, id) {
      this.$root.$router.push({
        name: routes.view.name,
        params: { id },
      });
    },
  },
  lifecycle: {
    beforeCreate({ dispatch }) {
      dispatch('fetch');
    },
  },
})(ListComponent);