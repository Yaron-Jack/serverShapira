import { prisma } from "..";

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