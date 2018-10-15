import store from '../src/store'

function retryInvoke(fn) {
  if (store.state.isInitialized) {
    fn()
  } else {
    console.log('retrying invoke...');
    setTimeout(() => retryInvoke(fn), 400)
  }
}

export default retryInvoke