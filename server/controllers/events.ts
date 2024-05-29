import { Request, Response } from "express"
import { AttendeeRole, Event } from '@prisma/client';
import { prisma } from "..";

export const addEvent = async (req: Request<Event>, res: Response) => {
  const reqEvent: Event = req.body;

  const newEvent = {
    startDate: reqEvent.startDate,
    endDate: reqEvent.endDate,
    title: reqEvent.title,
    description: reqEvent.description,
  }

  try {
    const event = await prisma.event.create({
      data: {
        ...newEvent,
        location: {
          connect: {
            id: reqEvent.locationId
          }
        }
      },
    });
    res.status(201).json(event);
  } catch (e: any) {
    console.log(e);
    res.status(400).send({ error: e.message })
  }
}

interface AddAttendeeArgs {
  attendee: {
    userId: string;
    role: AttendeeRole,
    productsForSale?: string[]
  };
  eventId: string
}

export const addAttendee = async (req: Request<AddAttendeeArgs>, res: Response) => {
  try {
    const newEvent = await prisma.event.update({
      where: {
        id: req.body.eventId
      },
      data: {
        attendees: {
          create: {
            ...req.body.attendee
          }
        }
      },
      include: {
        attendees: true
      }
    })
    res.status(201).send(newEvent);
  } catch (e: any) {
    console.log(e);
    res.status(400).send({ error: e.message })
  }
}

export const getAllEvents = async (_req: Request<Event>, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        location: true,
        attendees: {
          include: {
            user: true
          }
        }
      },
      where: {
        endDate: {
          gte: new Date()
        }
      }
    });
    res.status(200).send(events);
  }
  catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e.message });

  }
}

export const getLocations = async (_req: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany();
    res.status(200).send(locations);
  }
  catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e.message });

  }
}
