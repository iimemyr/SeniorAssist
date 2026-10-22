
import { NextResponse } from "next/server";

const guidance: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["social pension", "pension"],
    answer:
      "For social pension inquiries, contact your local Office for Senior Citizens Affairs (OSCA) or social welfare office. Ask them about current eligibility, application schedules, and required documents.",
  },
  {
    keywords: ["senior citizen id", "senior id", "id application"],
    answer:
      "For senior citizen ID applications, contact your local OSCA. Ask where to apply, which documents are required, and when applications are accepted.",
  },
  {
    keywords: ["medicine", "medical assistance", "health"],
    answer:
      "For medicine or health assistance, contact your local OSCA, social welfare office, or health center. Ask about available programs and current requirements.",
  },
  {
    keywords: ["requirements", "documents", "documentary"],
    answer:
      "Requirements depend on the service and your locality. Contact the office responsible for your request to confirm its current official checklist before visiting.",
  },
  {
    keywords: ["office", "contact", "where to ask"],
    answer:
      "You can start by contacting your local Office for Senior Citizens Affairs (OSCA) or local social welfare office. Confirm the correct office for your concern.",
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message =
      typeof body.message === "string"
        ? body.message.trim().toLowerCase()
        : "";

    if (!message) {
      return NextResponse.json(
        { answer: "Please type a question first." },
        { status: 400 }
      );
    }

    const match = guidance.find((item) =>
      item.keywords.some((keyword) => message.includes(keyword))
    );

    const answer = match
      ? match.answer
      : "I can help with general questions about senior citizen IDs, social pension, medicine assistance, and service requirements. Please tell me which service you need help with, or contact your local OSCA for guidance.";

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      { answer: "Something went wrong. Please try asking again." },
      { status: 500 }
    );
  }
}
