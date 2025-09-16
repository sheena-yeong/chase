import logo from "../../assets/chase_logo.png";

function NavBar() {
  return (
    <>
      <div className="navBar">
        <img src={logo} className="w-13 h-13 m-2 rounded-2xl"/>

        <h2 className="text-3xl">Chase</h2>
      </div>
    </>
  );
}

export default NavBar;
