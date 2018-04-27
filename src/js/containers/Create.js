import { connect } from 'vuex-connect';
import CreateComponent from '../components/Create';
import { routes } from '../libs/router';

export default connect({
  stateToProps: {
    item: state => state.item,
  },
  methodsToEvents: {
    onCreate({ dispatch }, params) {
      dispatch('create', params)
        .then((res) => {
          this.$root.$router.push({
            name: routes.view.name,
            params: { id: res.id },
          });
        });
    },
  },
  lifecycle: {
    beforeCreate({ commit }) {
      commit('setItem', {
        name: '',
        stocks: null,
        location: '',
        barcode: '',
      });
    },
  },
})(CreateComponent);
