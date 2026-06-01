// import { auth } from "@/auth";
// import connectDB from "@/lib/connectDB";
// import User from "@/model/user.model";
// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { sendResponse } from "next/dist/server/image-optimizer";

// export const POST = async (req: NextRequest) => {
//   try {
//     await connectDB();
//     const session = await auth();
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { success: false, message: "UnAuthorized Access" },
//         { status: 400 },
//       );
//     }
//     const senderId = session.user.id;
//     const { receiverId, text } = await req.json();

//     if (!receiverId || !text) {
//       return NextResponse.json(
//         { message: "receiver id and text are required" },
//         { status: 400 },
//       );
//     }
//     const senderObjectId = new mongoose.Types.ObjectId(senderId);
//     const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

//     // save in sender

//     await User.updateOne(
//       {
//         _id: senderObjectId,
//         "chats.with": receiverObjectId,
//       },
//       {
//         $push: {
//           "chats.$.messages": {
//             sender: senderObjectId,
//             text,
//             createdAt: new Date(),
//           },
//         },
//       },
//     );

//     const senderHaschats = await User.findOne({
//       _id: senderObjectId,
//       "chats.with": receiverObjectId,
//     });

//     if (!senderHaschats) {
//       await User.updateOne(
//         { _id: senderObjectId },
//         {
//           $push: {
//             chats: {
//               with: receiverObjectId,
//               messages: [
//                 {
//                   sender: senderObjectId,
//                   text,
//                   createdAt: new Date(),
//                 },
//               ],
//             },
//           },
//         },
//       );
//     }

//     //  save in receiver

//     await User.updateOne(
//       {
//         _id: receiverObjectId,
//         "chats.with": senderObjectId,
//       },
//       {
//         $push: {
//           "chats.$.messages": {
//             sender: senderObjectId,
//             text,
//             createdAt: new Date(),
//           },
//         },
//       },
//     );
//     const receiverHaschats = await User.findOne({
//       _id: receiverObjectId,
//       "chats.with": senderObjectId,
//     });

//     if (!receiverHaschats) {
//       await User.findOne(
//         { _id: receiverObjectId },
//         {
//           $push: {
//             chats: {
//               with: senderObjectId,
//               messages: [
//                 {
//                   sender: senderObjectId,
//                   text,
//                   createdAt: new Date(),
//                 },
//               ],
//             },
//           },
//         },
//       );
//     }
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.log("Error in send chats API : ", error);
//     return NextResponse.json(
//       { message: "Server error in send chats API" },
//       { status: 500 },
//     );
//   }
// };


import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized Access",
        },
        { status: 401 }
      );
    }

    const senderId = session.user.id;
    const { receiverId, text } = await req.json();

    if (!receiverId || !text) {
      return NextResponse.json(
        {
          success: false,
          message: "receiverId and text are required",
        },
        { status: 400 }
      );
    }

    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    const message = {
      sender: senderObjectId,
      text,
      createdAt: new Date(),
    };

    // =======================
    // SAVE IN SENDER
    // =======================

    const senderHasChat = await User.findOne({
      _id: senderObjectId,
      "chats.with": receiverObjectId,
    });

    if (senderHasChat) {
      await User.updateOne(
        {
          _id: senderObjectId,
          "chats.with": receiverObjectId,
        },
        {
          $push: {
            "chats.$.messages": message,
          },
        }
      );
    } else {
      await User.updateOne(
        { _id: senderObjectId },
        {
          $push: {
            chats: {
              with: receiverObjectId,
              messages: [message],
            },
          },
        }
      );
    }

    // =======================
    // SAVE IN RECEIVER
    // =======================

    const receiverHasChat = await User.findOne({
      _id: receiverObjectId,
      "chats.with": senderObjectId,
    });

    if (receiverHasChat) {
      await User.updateOne(
        {
          _id: receiverObjectId,
          "chats.with": senderObjectId,
        },
        {
          $push: {
            "chats.$.messages": message,
          },
        }
      );
    } else {
      await User.updateOne(
        { _id: receiverObjectId },
        {
          $push: {
            chats: {
              with: senderObjectId,
              messages: [message],
            },
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in send chat API:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error in send chat API",
      },
      { status: 500 }
    );
  }
};