import { connect } from 'vuex-connect';
import AppComponent from '../components/App';

export default connect({
  stateToProps: {
    item: () => ({
      name: '',
      stocks: null,
      location: '',
    }),
  },
  methodsToEvents: {
    onClickLink(vue, params) {
      this.$root.$router.push(params);
    },
  },
})(AppComponent);
