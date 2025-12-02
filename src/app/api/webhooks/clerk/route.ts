import connectDB from "@/app/mongodb";
import User from "@/models/User";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // get svix headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // check if svix headers are present
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }
  // Parse body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  // verify webhook
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Error: missing webhook secret", { status: 500 });
  }
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    return new Response("Error: Invalid webhook signature", { status: 400 });
  }

  // handle special events
  const eventType = evt.type;
  if (eventType === "user.created" || eventType == "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    try {
      await connectDB();
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          clerkId: id,
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
        {
          upsert: true,
          new: true,
        }
      );
    } catch (error) {
      return new Response("Error: Failed to syncing user to database", {
        status: 500,
      });
    }
  }
  return new Response("Webhook received", { status: 200 });
}

//! Suggested by deepSeek
// import connectDB from "@/app/mongodb";
// import User from "@/models/User";
// import { headers } from "next/headers";
// import { Webhook } from "svix";

// export async function POST(req: Request) {
//   // Connect to the database
//   await connectDB();

//   // Retrieve headers
//   const headerPayload = await headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   // Check if Svix headers are present
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response("Error: Missing Svix headers", { status: 400 });
//   }

//   // Parse request body
//   let payload;
//   try {
//     payload = await req.json();
//   } catch (err) {
//     return new Response("Invalid JSON payload", { status: 400 });
//   }

//   // Verify the webhook signature
//   const webhookSecret = process.env.SVIX_SECRET; // Ensure this is set in your environment variables
//   const wh = new Webhook(webhookSecret);

//   try {
//     // Verify the payload
//     const event = wh.verify(payload, svix_signature, svix_timestamp);

//     // Handle different event types
//     switch (event.type) {
//       case "user.created":
//         // Example: Create a new user in your database
//         await User.create({ /* user data from event.data */ });
//         break;
//       case "user.updated":
//         // Example: Update user info
//         break;
//       // Handle other event types as needed
//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     return new Response("Webhook received and processed", { status: 200 });
//   } catch (err) {
//     console.error("Webhook verification failed:", err);
//     return new Response("Invalid signature", { status: 400 });
//   }
// }
