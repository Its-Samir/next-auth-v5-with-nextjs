import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  let content;

  if (!session) {
    content = (
      <h1 className="text-5xl text-slate-800 text-center mt-[4rem]">NO USER FOUND</h1>
    );
  }

  else if (session && session.user)
    content = (
      <>
        <h1 className="text-5xl text-center mt-[4rem]">
          Hello, {" "}
          <span className="text-slate-500">
            {session.user.name?.toUpperCase()}
          </span>
        </h1>
        <div className="mx-auto w-max my-[2rem] border p-2 bg-emerald-200">
          <p className="text-xl text-emerald-700">You are logged in successfully</p>
        </div>
      </>
    );

  return content;
}
