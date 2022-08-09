import initProjectEventHandlers from './project';
import initUserEventHandlers from './user';

export default () => {
  initProjectEventHandlers();
  initUserEventHandlers();
};
