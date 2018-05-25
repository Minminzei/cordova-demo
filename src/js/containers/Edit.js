import { connect } from 'vuex-connect';
import EditComponent from '../components/Edit';

export default connect({
  stateToProps: {
    item: state => state.item,
    image: state => state.image,
    loading: state => state.loading,
  },
  methodsToEvents: {
    onSave({ dispatch }, params) {
      dispatch('update', params);
    },
    onUpload({ dispatch }, params) {
      dispatch('upload', params);
    },
  },
  lifecycle: {
    beforeCreate({ state, dispatch }) {
      dispatch('get', state.route.params.id);
    },
  },
})(EditComponent);