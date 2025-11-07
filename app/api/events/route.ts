import { NextRequest, NextResponse } from "next/server";
import { Event } from "../../types/event";
import { getAllEvents, createEvent } from "../../lib/eventStorage";

// Helper to generate unique ID
function generateId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// GET /api/events - List all events
export async function GET() {
  try {
    const events = getAllEvents();
    // Sort by date (upcoming first)
    const sortedEvents = [...events].sort((a, b) => {
      return Number(a.startsAt) - Number(b.startsAt);
    });

    return NextResponse.json({
      success: true,
      events: sortedEvents,
      count: sortedEvents.length,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      date,
      location,
      imageUrl,
      category,
      maxAttendees,
      price,
      creatorFid,
      creatorName,
    } = body;

    // Validation
    if (!title || !description || !date || !location || !creatorFid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: title, description, date, location, creatorFid",
        },
        { status: 400 }
      );
    }

    // Validate date
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Convert date to Unix timestamp (seconds)
    const startsAtTimestamp = Math.floor(eventDate.getTime() / 1000);

    const newEvent: Event = {
      id: generateId(),
      title,
      description,
      date: eventDate.toISOString(),
      location,
      maxAttendees: maxAttendees ? Number(maxAttendees) : 100, // Default to 100 if not provided
      tags: category ? [category] : [], // Convert category to tags array
      startsAt: BigInt(startsAtTimestamp),
      endsAt: BigInt(startsAtTimestamp + 7200), // Default to 2 hours after start
      imageUrl: imageUrl || undefined,
      creatorFid: Number(creatorFid),
      creatorName: creatorName || undefined,
      creatorAddress: undefined, // Will be added when wallet integration is implemented
      attendees: [],
      category: category || undefined,
      price: price ? Number(price) : undefined,
      createdAt: new Date().toISOString(),
    };

    createEvent(newEvent);

    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create event" },
      { status: 500 }
    );
  }
}
