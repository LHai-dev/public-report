// import { cookies } from "next/headers";
// import { cache } from "react";
// type ValidateRequestResult = {};
// export const validateRequest = cache(
//   async (): Promies<ValidateRequestResult> => {
//     const cookieStore = await cookies();
//     const sessionToken = cookieStore.get("session")?.value ?? null;

//     if (!sessionToken) {
//       return {
//         user: null,
//       };
//     }
//   },
// );
