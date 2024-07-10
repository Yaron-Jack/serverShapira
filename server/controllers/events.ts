import { Request, Response } from "express"
import { AttendeeRole, Event } from '@prisma/client';
import { prisma } from "..";
import { DateTime } from "luxon";

type RequestBody<T> = Request<{}, {}, T>;

interface EventDTO {
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  location: { id: string }
}

export const addEvent = async (req: RequestBody<EventDTO>, res: Response) => {
  const reqEvent: EventDTO = req.body;

  const luxonStartDateString = DateTime.fromISO(reqEvent.startDate).toString();
  const luxonEndDateString = DateTime.fromISO(reqEvent.endDate).toString();

  const newEvent = {
    startDate: luxonStartDateString,
    endDate: luxonEndDateString,
    title: reqEvent.title,
    description: reqEvent.description,
  }

  try {
    const event = await prisma.event.create({
      include: {
        attendees: true,
        location: true
      },
      data: {
        ...newEvent,
        location: {
          connect: {
            id: reqEvent.location.id
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
    productsForSale?: string[],
  };
  eventId: string
}


export const addAttendee = async (req: RequestBody<AddAttendeeArgs>, res: Response) => {
  const { attendee, eventId } = req.body;

  try {
    const existingAttendee = await prisma.attendee.findUnique({
      where: {
        userId_eventId: {
          userId: attendee.userId,
          eventId
        }
      }
    });

    if (existingAttendee) {
      // Update the existing attendee
      await prisma.attendee.update({
        where: {
          userId_eventId: {
            userId: attendee.userId,
            eventId
          }
        },
        data: {
          role: attendee.role,
          productsForSale: attendee.productsForSale || []
        }
      });


    } else {
      await prisma.attendee.create({
        data: {
          userId: attendee.userId,
          role: attendee.role,
          productsForSale: attendee.productsForSale || [],
          eventId: eventId
        }
      });
    }

    getUpcomingEvents(req, res)
  } catch (e: any) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
}


interface RemoveAttendeeArgs {
  userId: string;
  eventId: string;
}

export const removeAttendee = async (req: RequestBody<RemoveAttendeeArgs>, res: Response) => {
  const { userId, eventId } = req.body;

  try {
    await prisma.attendee.delete({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });

    getUpcomingEvents(req, res);
  } catch (e: any) {
    if (e.code === 'P2025') {
      return res.status(404).send({ error: 'Attendee not found' });
    }

    console.log(e);
    res.status(400).send({ error: e.message });
  }
}


export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        location: true,
        attendees: {
          include: {
            user: true
          }
        }
      }
    });

    res.status(200).json(events)
  } catch (e: any) {
    console.log(e);
    res.status(200).send({ error: e.message })
  }
}

export const getUpcomingEvents = async (_req: RequestBody<any>, res: Response) => {
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

export const deleteEvent = async (req: RequestBody<{ id: string }>, res: Response) => {
  try {
    await prisma.event.delete({
      where: {
        id: req.body.id,
      }
    });
    getUpcomingEvents(req, res);

  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e.message })
  }
}

interface UpdateEventReqBody extends Omit<Event, 'locationId'> {
  location: {
    id: string;
  }
}

export const updateEvent = async (req: RequestBody<UpdateEventReqBody>, res: Response) => {
  try {
    await prisma.event.update({
      where: {
        id: req.body.id
      },
      data: {
        ...req.body,
        id: req.body.id,
        location: {
          update: {
            ...req.body.location
          }
        }
      }
    });

    getUpcomingEvents(req, res);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e.message })
  }
}
