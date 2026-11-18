import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MessageDTO } from "@/types/rooms";

interface ChatItemsProps {
  currentUserId: string;
  messages: MessageDTO[];
}

function formatMessageTime(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export default function ChatItems({ messages, currentUserId }: ChatItemsProps) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-3">
        {messages.map((message) => {
          const isOwn = message.sender.id === currentUserId;
          const { name } = message.sender;

          return (
            <div
              className={`group border-border relative flex items-start gap-3 rounded-lg border p-3 transition-all duration-150 ${
                isOwn
                  ? "bg-secondary/20 ml-6 md:ml-12"
                  : "bg-card hover:bg-muted/30 mr-6 md:mr-12"
              }`}
              key={message.id}
            >
              <Avatar className="size-10 shrink-0 rounded-full border border-white/20 shadow-md">
                {message.sender.image && (
                  <AvatarImage
                    alt={name}
                    className="object-cover"
                    src={message.sender.image}
                  />
                )}

                <AvatarFallback className="text-sm font-bold tracking-wider">
                  {name
                    .split(" ")
                    .map((part) => part.charAt(0))
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-foreground truncate text-xs font-semibold">
                    {name}
                  </span>

                  <span className="text-muted-foreground text-micro! ml-auto font-mono">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>

                <p className="text-foreground/90 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
