"use client";

import {
  CircleArrowUp,
  Disc3,
  ListMusic,
  Music,
  Plus,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ActiveTab = "UPLOAD" | "CURATED";

const FILE_EXTENSION_REGEX = /\.[^/.]+$/u;

export function PlaylistDialog({ isWide = false }: { isWide?: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("UPLOAD");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const handleFileChange = (selectedFile: File | undefined) => {
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    if (!title) {
      setTitle(selectedFile.name.replace(FILE_EXTENSION_REGEX, ""));
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          isWide ? (
            <Button
              className="focus-visible:ring-ring border-border bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-7 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-medium shadow-xs transition-colors select-none focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              variant="outline"
            >
              <ListMusic className="text-primary size-3.5!" />

              <span className="hidden sm:inline">Musics</span>

              <span className="py-0.2 bg-secondary text-secondary-foreground text-nano rounded-full px-1.5 font-semibold">
                3
              </span>
            </Button>
          ) : (
            <button
              className="hover:bg-muted hover:text-foreground cursor-pointer rounded p-1 transition-colors"
              title="Add music to room"
              type="button"
            >
              <Music className="h-4 w-4" />
            </button>
          )
        }
      />

      <DialogContent className="gap-0 p-6">
        <DialogHeader className="border-border flex flex-row items-start justify-between space-y-0 border-b pb-3">
          <div className="space-y-1">
            <DialogTitle className="text-base">
              Sound Lounge & Shared Playlist
            </DialogTitle>

            <DialogDescription className="text-xs leading-relaxed">
              Collaborative synchronized playlist. Only appointed DJs and the
              Room Host can playlist tracks.
            </DialogDescription>
          </div>
        </DialogHeader>

        <Tabs className="mt-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="border-border mb-4 flex h-auto w-full justify-start gap-2 rounded-none border-b bg-transparent p-0 pb-2">
            <TabsTrigger
              className={cn(
                "gap-1.5 rounded-md p-3.5! text-xs",
                activeTab === "UPLOAD" && "bg-primary! text-background!"
              )}
              value="UPLOAD"
            >
              <Upload className="size-3.5" />
              Upload Track
            </TabsTrigger>

            <TabsTrigger
              className={cn(
                "gap-1.5 rounded-md p-3.5! text-xs",
                activeTab === "CURATED" && "bg-primary! text-background!"
              )}
              value="CURATED"
            >
              <Disc3 className="size-3.5" />
              Curated Soundscapes
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-0" value="UPLOAD">
            <form className="space-y-4">
              <input
                accept="audio/mpeg,.mp3"
                className="hidden"
                onChange={(event) => handleFileChange(event.target.files?.[0])}
                ref={fileInputRef}
                type="file"
              />

              <button
                className="group border-border bg-muted/20 hover:border-primary/60 hover:bg-muted/40 w-full cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleFileChange(event.dataTransfer.files[0]);
                }}
                type="button"
              >
                <div className="bg-secondary text-secondary-foreground mx-auto mb-2.5 flex size-10 items-center justify-center rounded-full">
                  <Upload className="size-5" />
                </div>

                <div>
                  <p className="text-foreground text-sm font-medium">
                    {file ? file.name : "Click to browse or drop an audio file"}
                  </p>

                  <p className="text-muted-foreground mt-0.5 text-xs">
                    MP3 supported
                  </p>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs" htmlFor="track-title">
                    Track Title
                  </Label>

                  <Input
                    className="text-sm"
                    id="track-title"
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Midnight Serenade"
                    required
                    value={title}
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs" htmlFor="artist-name">
                    Artist Name
                  </Label>

                  <Input
                    className="text-sm"
                    id="artist-name"
                    onChange={(event) => setArtist(event.target.value)}
                    placeholder="e.g. Lo-Fi Beats"
                    value={artist}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  className={"text-xs"}
                  onClick={() => setOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>

                <Button
                  className={"rounded-lg text-xs!"}
                  disabled={!(file && title.trim())}
                  type="submit"
                >
                  <Plus className="size-4" />
                  Add to Playlist
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent className="mt-0" value="CURATED">
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              <div className="border-border bg-card hover:bg-muted/40 flex items-center justify-between rounded-lg border p-2.5 transition-colors">
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    alt="Rainy Night In Shibuya"
                    className="border-border h-9 w-9 shrink-0 rounded-md border object-cover"
                    height={36}
                    src="/music-01.jpg"
                    width={36}
                  />

                  <div className="min-w-0">
                    <p className="text-foreground truncate text-xs font-semibold">
                      Rainy Night In Shibuya
                    </p>
                    <p className="text-muted-foreground text-micro truncate">
                      Aura Collective · <span className="capitalize">lofi</span>
                    </p>
                  </div>
                </div>

                <Button
                  className="text-foreground h-7 gap-1.5 rounded-md px-2 text-xs"
                  size="sm"
                  title="Play right now"
                  variant="ghost"
                >
                  <CircleArrowUp className="mr-1 h-3.5 w-3.5" />
                  Play
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
