// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { sendMessage } from "../../services/apiMessage";
// import { useParams } from "react-router-dom";
// import { useEffect } from "react";
// import { useSocket } from "../../context/SocketContext";
// import useUser from "../authentication/useUser";

// // Let Socket Handle Updates
// //Simple, reliable. User waits for server → message appears when socket event arrives.
// //Slightly slower feedback.

// // const useMessage = () => {
// //   const { mutate: message, isPending } = useMutation({
// //     mutationFn: sendMessage,
// //   });

// //   return { message, isPending };
// // };

// // export default useMessage;

// const useMessage = () => {
//   const queryClient = useQueryClient();
//   const { user } = useUser();
//   const { channelId } = useParams();

//   const socket = useSocket();
//   const { mutate: message, isPending } = useMutation({
//     mutationFn: sendMessage,

//     //1. optimistic update --> preupdate
//     onMutate: async (newMsg) => {
//       await queryClient.cancelQueries({ queryKey: ["channel", channelId] });

//       const prevData = queryClient.getQueryData(["channel", channelId]);
//       const tempId = "temp-" + Date.now();
//       queryClient.setQueryData(["channel", channelId], (old) => {
//         if (!old) return;
//         return {
//           ...old,
//           messages: [
//             ...old.messages,
//             {
//               _id: tempId,
//               content: newMsg.text,
//               sender: { fullname: "You", _id: user._id },
//               pending: true,
//               createdAt: new Date().toISOString(),
//             },
//           ],
//         };
//       });

//       return { prevData };
//     },

//     //2. Rollback if api failed
//     onError: (err, newMsg, ctx) => {
//       if (ctx?.prevData)
//         queryClient.setQueryData(["channel", channelId], ctx.prevData);
//     },

//     // onSuccess: (data) => {
//     //   queryClient.setQueryData(["channel", channelId], (old) => {
//     //     if (!old) return old;
//     //     return {
//     //       ...old,
//     //       messages: old.messages.map((m) =>
//     //         m.pending ? data.data.message : m
//     //       ),
//     //     };
//     //   });
//     // },
//   });

//   useEffect(() => {
//     if (!channelId) return;

//     socket.on("newMessage", (msg) => {
//       // Update channel messages in cache

//       queryClient.setQueryData(["channel", channelId], (old) => {
//         if (!old) return;
//         return {
//           ...old,
//           messages: [
//             // Replace pending if same sender + content
//             ...old.messages.filter(
//               (m) =>
//                 !(
//                   m.pending &&
//                   m.sender._id === msg.sender._id &&
//                   m.content === msg.content
//                 )
//             ),
//             msg,
//           ],
//         };
//       });
//     });

//     return () => {
//       socket.off("newMessage");
//     };
//   }, [channelId, socket, queryClient]);

//   return { message, isPending };
// };

// export default useMessage;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../../services/apiMessage";
import { useParams } from "react-router-dom";
import useUser from "../authentication/useUser";

const useMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { channelId } = useParams();

  const { mutate: message, isPending } = useMutation({
    mutationFn: sendMessage,

    // 1. Optimistic update
    onMutate: async (newMsg) => {
      await queryClient.cancelQueries({ queryKey: ["channel", channelId] });

      const prevData = queryClient.getQueryData(["channel", channelId]);

      const tempId = "temp-" + Date.now();

      queryClient.setQueryData(["channel", channelId], (old) => {
        if (!old) return;
        return {
          ...old,
          messages: [
            ...old.messages,
            {
              _id: tempId,
              content: newMsg.text,
              sender: { fullname: "You", _id: user._id },
              pending: true,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      });

      return { prevData };
    },

    // 2. Rollback if failed
    onError: (err, newMsg, ctx) => {
      if (ctx?.prevData)
        queryClient.setQueryData(["channel", channelId], ctx.prevData);
    },

    // 3. No onSuccess update — socket will handle real message
  });

  return { message, isPending };
};

export default useMessage;
