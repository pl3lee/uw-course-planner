import { auth, signIn, signOut } from "@/server/auth";
import {
  getTemplates,
  getUserPlan,
  getUserSelectedTemplates,
} from "@/server/db/queries";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TemplateSelector } from "./TemplateSelector";
import { TabSelector } from "./TabSelector";

export default async function Navbar() {
  const session = await auth();
  const templates = await getTemplates();
  const selectedTemplates = session?.user
    ? await getUserSelectedTemplates(session.user.id)
    : [];
  const userPlan = session?.user ? await getUserPlan(session.user.id) : null;
  return (
    <nav className="p-4">
      <div className="container mx-auto flex items-center justify-end gap-4">
        <TabSelector />

        {session?.user && userPlan && (
          <TemplateSelector
            templates={templates}
            selectedTemplates={selectedTemplates}
          />
        )}

        {!session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">Sign in</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <form
                  action={async () => {
                    "use server";
                    await signIn("google");
                  }}
                >
                  <button type="submit">with Google</button>
                </form>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <form
                  action={async () => {
                    "use server";
                    await signIn("github");
                  }}
                >
                  <button type="submit">with GitHub</button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit" variant="default">
              Sign Out
            </Button>
          </form>
        )}
      </div>
    </nav>
  );
}
