import logo from "../../assets/chase_logo.png";

function NavBar() {
  return (
    <>
      <div className="flex items-center text-white bg-[#4775ff] px-[15px] h-[70px]">
        <img src={logo} className="w-13 h-13 m-2 rounded-2xl" />

        <h2 className="text-4xl font-bold m-2">Chase</h2>
      </div>
    </>
  );
}

export default NavBar;
