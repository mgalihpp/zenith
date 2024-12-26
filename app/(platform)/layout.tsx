import Navbar from '@/components/Navbar';
import MenuBar from '@/components/Navbar/MenuBar';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import SessionProvider from '@/components/SessionProvider';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <main className="min-h-screen flex flex-col">
          <Navbar />
          <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
            <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
            {children}
          </div>
          <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
        </main>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
