import MusicPlayer from "@/components/layout/footer/music-player";
import Header from "@/components/layout/header/header";
import { AppSidebar } from "@/components/layout/sidebar/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SidebarProvider className="min-h-0 w-full flex-1 flex-col overflow-hidden">
        <Header />

        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <AppSidebar />
          {children}
        </div>
      </SidebarProvider>

      <MusicPlayer />
    </div>
  );
}
