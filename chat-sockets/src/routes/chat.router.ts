import SocketRouter from '../utils/socket/SocketRouter';
import { ChatEvents } from '../const/events/chat.events';
import controller from './chat.controller';

const router = new SocketRouter('chat:');

router.addRoute(ChatEvents.JOIN, controller.joinHandler);
router.addRoute(ChatEvents.SEND_MESSAGE, controller.sendMessage);

export default router;
