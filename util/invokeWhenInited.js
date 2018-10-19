import store from '../src/store'

function invokeWhenInited(fn) {
  // Prevents errors on page refresh due to contract calls
  // being made before contract instance created
  if (store.state.isInitialized) {
    fn()
  } else {
    setTimeout(() => invokeWhenInited(fn), 400)
  }
}

export default invokeWhenInited