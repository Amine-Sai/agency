import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
pubsub.subscribe;

const resolver = {
  Query: {
    getChat: async (_: unknown, { requestID }: { requestID: number }) => {
      try {
        const chat = await prisma.chat.findUnique({
          where: { requestID: requestID },
          include: { messages: true },
        });
        if (!chat) throw new Error("Chat unavailable.");
        return chat;
      } catch (error) {
        console.log(error);
        throw new Error("Internal error");
      }
    },
    getMessage: async (_: unknown, { messageID }: { messageID: number }) => {
      try {
        const message = await prisma.message.findUnique({
          where: { id: messageID },
        });
        if (!message) throw new Error("Chat unavailable.");
        return message;
      } catch (error) {
        console.log(error);
        throw new Error("Internal error");
      }
    },
  },
  Mutation: {
    sendMessage: async (
      _: unknown,
      {
        chatID,
        userID,
        content,
      }: { chatID: number; userID: number; content: string }
    ) => {
      try {
        if (!content || content.length > 256)
          throw new Error("Invalid message.");

        let chat = await prisma.chat.findUnique({ where: { id: chatID } });
        if (!chat) throw new Error("Chat unavailable");

        const request = await prisma.request.findUnique({
          where: { id: chat.requestID },
          select: { status: true },
        });
        if (!request || request.status != "pending")
          throw new Error("Chat closed.");

        const message = await prisma.message.create({
          data: {
            chatID,
            userID,
            content,
          },
        });

        // Publish the message to the subscription channel
        const CHAT_CHANNEL = "CHAT_CHANNEL" + `${chatID}`;
        pubsub.publish(CHAT_CHANNEL, { messageSent: message });

        return message;
      } catch (error) {
        throw new Error("Unable to send message.");
      }
    },
  },

  /*  Chat: {
    messages: async (parent: any) => {
      try {
        console.log(parent);

        if (!parent) throw new Error("Error occured");
        const message = await prisma.message.findUnique({
          where: {
            chatID: parent.id,
          },
        });
        if (!message) {
          throw new Error("Chat closed");
        }
        return message;
      } catch (error) {
        console.error("Error fetching service:", error);
        throw new Error("Failed to fetch service.");
      }
    }, */
  Chat: {
    request: async (parent: any) => {
      try {
        console.log(parent);

        if (!parent || !parent.requestID) {
          throw new Error("Error occured");
        }
        const request = await prisma.request.findUnique({
          where: { id: parent.requestID },
        });

        return request;
      } catch (error) {
        console.log(error);
        throw new Error("Invalid request");
      }
    },
  },
  Message: {
    user: async (parent: any) => {
      try {
        if (!parent || !parent.userID) {
          throw new Error("Error occured");
        }
        const user = await prisma.user.findUnique({
          where: { id: parent.userID },
          select: { id: true },
        });

        return user;
      } catch (error) {
        console.log(error);
        throw new Error("Invalid request");
      }
    },
  },

  Subscription: {
    messageSent: {
      subscribe: (_: unknown, { chatID }: { chatID: number }) => {
        const CHAT_CHANNEL = "CHAT_CHANNEL" + `${chatID}`;
        return pubsub.asyncIterableIterator([CHAT_CHANNEL]);
      },
    },
  },
};
export default resolver;
