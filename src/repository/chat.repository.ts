import prisma from "../config/dbconfig";

class ChatRepository {
   // Get or create a chat between two users
   async getOrCreateChat(user1Id: number, user2Id: number) {
      // Ensure consistent ordering of IDs for unique constraint
      const [participant1Id, participant2Id] = [user1Id, user2Id].sort((a, b) => a - b);

      if (user1Id === user2Id) {
         throw new Error('Cannot create chat with yourself');
      }

      // Check if chat already exists
      let chat = await prisma.chat.findFirst({
         where: {
         participant1Id,
         participant2Id,
         },
         include: {
         participant1: true,
         participant2: true,
         lastMessage: true,
         },
      });

       // If not exists, create new chat
      if (!chat) {
          // Ensure both users exist
         const [user1, user2] = await Promise.all([
            prisma.user.findUnique({ where: { id: user1Id } }),
            prisma.user.findUnique({ where: { id: user2Id } }),
         ]);

         if (!user1 || !user2) {
            throw new Error('One or both users not found');
         }

          chat = await prisma.chat.create({
            data: {
               participant1Id,
               participant2Id,
            },
            include: {
               participant1: true,
               participant2: true,
               lastMessage: true,
            },
         });
      }
      return chat;
   }

   // Send a message
   async sendMessage(chatId: number, senderId: number, content: string, attachments: { url: string; name: string }[] = []) {
      // Verify user is part of the chat
      const chat = await prisma.chat.findUnique({
         where: { id: chatId },
      });
      
      const message = await prisma.$transaction(async (tx) => {
         // Create the message
         const newMessage = await tx.message.create({
         data: {
            chatId,
            senderId,
            content,
            attachments: attachments.map(att => JSON.stringify(att)),
            readBy: [senderId], // Sender has read their own message
         },
         });
         
         // Update chat's last message
         await tx.chat.update({
         where: { id: chatId },
         data: {
            lastMessageId: newMessage.id,
            updatedAt: new Date(),
         },
         });
         
         return newMessage;
      });
      
      return message;
   }

   // Get user's chats
  async getUserChats(userId: number) {
   const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
        status: 'ACTIVE',
      },
      include: {
        participant1: true,
        participant2: true,
        lastMessage: true,
        _count: {
          select: {
            messages: {
              where: {
                isDeleted: false,
                senderId: { not: userId },
                status: { in: ['SENT', 'DELIVERED'] },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return chats.map(chat => ({
      ...chat,
      otherParticipant: chat.participant1Id === userId ? chat.participant2 : chat.participant1,
      unreadCount: chat._count.messages,
    }))
  }

   // Mark messages as read
  async markMessagesAsRead(chatId: number, userId: number, messageIds: number[]) {
    
    const messages =  await prisma.message.updateMany({
      where: {
         AND: [
            { id: { in: messageIds } },
            { chatId: chatId },
            { senderId: { not: userId } },
         ],
      },
      data: {
         status: "READ",
         readBy: {
            push: userId,
         },
      },
      });

    return messages;
  }

  // Update user presence
  async updateUserPresence(userId: number, isOnline: boolean, socketId?: string) {
    const presence = await prisma.userPresence.upsert({
      where: { userId },
      update: {
        isOnline,
        lastSeen: isOnline ? new Date() : undefined,
        socketId,
        updatedAt: new Date(),
      },
      create: {
        userId,
        isOnline,
        socketId,
      },
    });
    
    return presence;
  }

   // Get user presence
  async getUserPresence(userId: number) {
    return await prisma.userPresence.findUnique({
      where: { userId },
    });
  }

  // Get multiple users' presence
  async getUsersPresence(userIds: number[]) {
    return await prisma.userPresence.findMany({
      where: {
        userId: { in: userIds },
      },
    });
  }

  // Get chat messages with pagination
  async getChatMessages(chatId: number, userId: number, page: number = 1, limit: number = 50) {
    // Verify user is part of the chat
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });
    
    const skip = (page - 1) * limit;
    
    const messages = await prisma.message.findMany({
      where: {
        chatId,
        isDeleted: false,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });
    
    // Mark messages as delivered if not already
    const unreadMessageIds = messages
      .filter(msg => msg.status === 'SENT' && msg.senderId !== userId)
      .map(msg => msg.id);
    
    if (unreadMessageIds.length > 0) {
      await prisma.message.updateMany({
        where: {
          id: { in: unreadMessageIds },
        },
        data: {
          status: 'DELIVERED',
        },
      });
    }
    
    return messages.reverse(); // Return in chronological order
  }

}

export default new ChatRepository();