import SocketRouter from '../utils/socket/SocketRouter';
import { CallEvents } from '../const/events/call.events';
import controller from './chat.controller';

const router = new SocketRouter('chat:');

router.addRoute(CallEvents.SEND_MESSAGE, controller.sendMessage);

export default router;
