import Navbar from '../components/Navbar';

export default function Marketplace() {
  return (
    // <div className="layout-nav border-b border-black relative top-0">
    //         <nav className="h-20 px-24 px-0  m-auto flex justify-between items-center"></nav>
    <div >
      <Navbar />
      <div className="flex flex-col items-center p-0 md:w-[1200px] m-auto">
        <div className="flex min-h-screen flex-col items-center justify-center p-0">
          <div className="relative flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
            <p className="text-[48px] text-blod">Coming soon ...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
