import SocketRouter from '../utils/socket/SocketRouter';
import { CallEvents } from '../const/events/call.events';
import controller from './call.controller';

const router = new SocketRouter('call:');

router.addRoute(CallEvents.JOIN, controller.joinHandler);
router.addRoute(CallEvents.RELAY_ICE, controller.relayIceHandler);
router.addRoute(CallEvents.RELAY_SDP, controller.relaySdpHandler);
router.addRoute(CallEvents.LEAVE, controller.leaveHandler);
router.addRoute(CallEvents.MUTE_UNMUTE, controller.muteUnmuteHandler);

export default router;
