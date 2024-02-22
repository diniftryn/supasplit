import { Context } from "./route";

export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: Context) => {
      return await context.prisma.user.findMany();
    },

    groups: async (parent: any, args: any, context: Context) => {
      return await context.prisma.group.findMany({
        include: { users: true, expenses: true }
      });
    },

    group: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.group.findUnique({
        where: {
          id: args.id
        }
      });
    },

    expenses: async (parent: any, args: any, context: Context) => {
      return await context.prisma.expense.findMany({
        include: { group: true }
      });
    },

    expense: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.group.findUnique({
        where: {
          id: args.id
        }
      });
    },

    participants: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.participant.findUnique({
        where: {
          id: args.id
        }
      });
    },

    Group: {
      users: async (parent: any, _args: any, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: parent.userId
          }
        });
      },
      expenses: async (parent: any, _args: any, context: Context) => {
        return await context.prisma.expense.findUnique({
          where: {
            id: parent.expenseId
          }
        });
      }
    },

    Expense: {
      payer: async (parent: any, _args: any, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: parent.userId
          }
        });
      },
      participants: async (parent: any, _args: any, context: Context) => {
        return await context.prisma.participant.findUnique({
          where: {
            id: parent.participantId
          }
        });
      }
    },

    Participant: {
      user: async (parent: any, _args: any, context: Context) => {
        return await context.prisma.user.findUnique({
          where: {
            id: parent.userId
          }
        });
      }
    }
  },

  Mutation: {
    addUser: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.user.create({
        data: {
          username: args.username,
          email: args.email
        }
      });
    },
    addGroup: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.group.create({
        data: {
          groupName: args.groupName,
          imageUrl: args.imageUrl,
          usersId: args.usersId
        }
      });
    }
  }
};
