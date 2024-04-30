import { useRef, useState, useEffect } from "react";
import "regenerator-runtime/runtime";

export const Settings = ({setPerformance,performance}) => {
  const ref = useRef();
  const [showMenu, setShowMenu] = useState(false);

  const selectAudio = new Audio("/audio/select.mp3");

  const selectPerformance =(performance) => {
    setPerformance(performance)
    setShowMenu(false)
    selectAudio.play();
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref])

  return (
    <div>
    <div ref={ref} x-data="{ show: false, menu: false }">
      <button className="pointer-events-auto text-sm text-white font-semibold bg-emerald-600 px-4 py-2 rounded-full border-white border rounded-md outline-none hover:bg-emerald-500"
        onClick={()=>setShowMenu(!showMenu)}>
        <span className="flex">
          <img className="invert mr-2" width="20" src="/textures/gear.png" />
          Performance
        </span>
      </button>
      {showMenu&&(
      <div className="relative">
      <div className="bg-white bg-opacity-80 rounded-md p-3 min-w-[115px] top-1  absolute z-10" 
          x-transition:enter="transition ease-out duration-100"
          x-transition:enter-start="transform opacity-0 scale-95">
        <ul
            className="[&>li]:text-black [&>li]:text-sm [&>li]:cursor-pointer [&>li]:px-2 [&>li]:py-1 [&>li]:rounded-md [&>li]:transition-all active:[&>li]:scale-[0.99]">
          <li className={`pointer-events-auto font-semibold hover:text-emerald-600 ${performance=='Quality'&& 'underline decoration-4 decoration-emerald-600'}`} onClick={()=>{selectPerformance('Quality')}}>Quality</li>
          <li className={`pointer-events-auto font-semibold hover:text-emerald-600 ${performance=='Balanced'&& 'underline decoration-4 decoration-emerald-600'}`} onClick={()=>{selectPerformance('Balanced')}}>Balanced</li>
          <li className={`pointer-events-auto font-semibold hover:text-emerald-600 ${performance=='Fast'&& 'underline decoration-4 decoration-emerald-600'}`} onClick={()=>{selectPerformance('Fast')}}>Fast</li>
        </ul>
      </div>
    </div>)}
    </div>
  </div>
  );
};
