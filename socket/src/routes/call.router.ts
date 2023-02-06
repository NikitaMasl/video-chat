import SocketRouter from '../utils/socket/SocketRouter';
import { CallEvents } from '../const/events/call.events';
import controller from './call.controller';

const router = new SocketRouter('call:');

router.addRoute(CallEvents.JOIN, controller.joinHandler);

export default router;
