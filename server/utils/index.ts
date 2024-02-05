import { CompostReport, Prisma } from "@prisma/client";
import { prisma } from "..";
import { UserWithTransactionsCount } from "../../types/userTypes";
import { DepositDTO } from "../../types/transactionTypes";
import { standsNameToIdMap } from "../../constants/compostStands";

export const findUserIdByPhoneNumber = async (phoneNumber: string): Promise<string> => {
    try {

        const user = await prisma.user.findUnique({ where: { phoneNumber: phoneNumber } });
        if (!user) {
            throw new Error('No user exists for this number');
        }
        return user.id;
    } catch (error: any) {
        throw new Error(error);
    }
}

export const convertUserWithTransactionsCountToCountArray = (userWithTransactionsCount: UserWithTransactionsCount[]): number[] => {
    return userWithTransactionsCount.map(n => n._count.transactions);
}

export const convertdepositDTOToCompostReportData = (depositDTO: DepositDTO): Prisma.CompostReportUncheckedCreateInput => {
    const { compostReport, userId } = depositDTO;

    const compostSmell = compostReport?.compostSmell;
    // TODO legacy yes/no option remove on frontend update
    const compostSmellBoolean = compostSmell && typeof compostSmell === 'boolean' ? compostSmell : compostSmell === 'yes'; 

    
    return {
        depositWeight: new Prisma.Decimal(compostReport.depositWeight),
        dryMatterPresent: compostReport.dryMatter,
        notes: compostReport.notes,
        compostStandId: standsNameToIdMap[compostReport.compostStand],
        bugs: compostReport.bugs,
        full: compostReport.full,
        scalesProblem: compostReport.scalesProblem,
        cleanAndTidy: compostReport.cleanAndTidy,
        compostSmell: compostSmellBoolean,
        userId
      };      
}

export const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];