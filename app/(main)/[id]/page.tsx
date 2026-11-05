import ChatInput from "@/components/lounge-page/chat-input";
import ChatItem from "@/components/lounge-page/chat-items";
import LoungeHeader from "@/components/lounge-page/lounge-header";
import { MembersSidebar } from "@/components/lounge-page/members-sidebar";

export default function LoungePage() {
  return (
    <>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="bg-background relative m-4 flex min-h-0 flex-1 flex-col">
          <LoungeHeader />
          <ChatItem />
        </div>

        <ChatInput />
      </div>

      <MembersSidebar />
    </>
  );
}
