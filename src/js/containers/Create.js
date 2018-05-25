import { connect } from 'vuex-connect';
import CreateComponent from '../components/Create';
import { routes } from '../libs/router';

export default connect({
  stateToProps: {
    item: state => state.item,
    image: state => state.image,
    loading: state => state.loading,
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
    onUpload({ dispatch }, params) {
      dispatch('upload', params);
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
      commit('setImage', null);
    },
  },
})(CreateComponent);
