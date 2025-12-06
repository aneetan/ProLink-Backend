import PusherConfig from "../config/pusher.config";
import { NotificationData } from "../types/pusher/notifications.type";

class NotificationService {
   private static instance: NotificationService;

   public static getInstance(): NotificationService {
      if (!NotificationService.instance) {
         NotificationService.instance = new NotificationService();
      }
      return NotificationService.instance;
   }

   /**
   * Send notification to all users (public channel)
   */
  async sendToAll(notification: Omit<NotificationData, 'id' | 'timestamp'>): Promise<void> {
      try {
         const notificationWithId: NotificationData = {
         ...notification,
         timestamp: new Date(),
         channel: notification.channel || 'public-notifications'
         };

         await PusherConfig.trigger(
         notification.channel || 'public-notifications',
         'new-notification',
         notificationWithId
         );
      } catch (error) {
         console.error('Error sending notification to all:', error);
         throw error;
      }
   }

    /**
   * Send notification to specific user (private channel)
   */
  async sendToUser(userId: number, notification: Omit<NotificationData, 'id' | 'timestamp' | 'userId'>): Promise<void> {
      try {
         const notificationWithId: NotificationData = {
         ...notification,
         timestamp: new Date(),
         userId,
         channel: `private-user-${userId}`
         };

         await PusherConfig.trigger(
         `private-user-${userId}`,
         'new-notification',
         notificationWithId
         );
      } catch (error) {
         console.error('Error sending notification to user:', error);
         throw error;
      }
   }

   /**
   * Send notification to specific channel
   */
   async sendToChannel(channelName: string, event: string, data: any): Promise<void> {
      try {
         await PusherConfig.trigger(channelName, event, data);
      } catch (error) {
         console.error('Error sending notification to channel:', error);
         throw error;
      }
   }

   /**
   * Get presence information for a channel
   */
   async getChannelPresence(channelName: string): Promise<any> {
      try {
         const response = await PusherConfig.get({
         path: `/channels/${channelName}/users`,
         params: {}
         });
         return response;
      } catch (error) {
         console.error('Error getting channel presence:', error);
         throw error;
      }
   }
}

export default new NotificationService();
