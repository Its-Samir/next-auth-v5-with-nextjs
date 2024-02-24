import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { auth, signOut } from "@/auth";

export default async function NavBar() {
  const session = await auth();

  async function handleSignOut() {
    "use server";
    await signOut();
  }

  let authContent;

  if (!session || !session.user) {
    authContent = null;
  }
  else if (session && session.user) {
    authContent = (
      <Popover>
        <PopoverTrigger className="flex items-center justify-between gap-2">
          <UserIcon className="border rounded-full p-1" />
          <span className="font-semibold">{session.user.username}</span>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2 w-max p-2">
          <Button
            children="Dashboard"
            variant={"outline"}
            size={"sm"}
            className="w-full"
          />
          <form action={handleSignOut}>
            <Button
              children="Sign Out"
              size={"sm"}
              className="w-full"
            />
          </form>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <nav className="flex justify-between items-center px-[1.5rem] border">
      <h1 className="text-slate-800 text-2xl">logo</h1>
      {authContent}
    </nav>
  )
}
