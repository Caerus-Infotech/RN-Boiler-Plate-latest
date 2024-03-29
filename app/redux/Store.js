import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../saga/index';
import immutablePersistenceTransform from '../services/immutablePersistenceTransform';
import rootReducer from './index';

const sagaMonitor = __DEV__ ? console.tron.createSagaMonitor() : null;
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
const middleWare = [sagaMiddleware];

const persistConfig = {
  key: '@demo',
  storage: AsyncStorage,
  blacklist: ['nav', 'navigation'],
  transforms: [immutablePersistenceTransform]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Add middleware to redux store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = applyMiddleware(...middleWare);

const enhancers = __DEV__
  ? composeEnhancers(middlewares, console.tron.createEnhancer())
  : compose(middlewares);

const store = createStore(persistedReducer, enhancers);

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

// Enable persistence
export default { store, persistor };
