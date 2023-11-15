import { prisma } from "..";
import { UserWithTransactionsCount } from "../../types/userTypes";

export const findUserIdByPhoneNumber = async (phoneNumber: string): Promise<string> => {
    try {

        const user = await prisma.user.findUnique({ where: { phoneNumber: phoneNumber } });
        if (!user) {
            throw new Error('User not found');
        }
        return user.id;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const convertUserWithTransactionsCountToCountArray = (userWithTransactionsCount: UserWithTransactionsCount[]): number[] => {
    return userWithTransactionsCount.map(n => n._count.transactions);
}

export const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];