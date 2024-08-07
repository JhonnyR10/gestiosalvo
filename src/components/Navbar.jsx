import { CurrencyEuro, House } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleNavigate = (path) => () => {
    navigate(path);
  };
  return (
    <>
      {location.pathname !== "/" ? (
        <div className="mb-1">
          <nav className="navbar navbar-dark bg-dark ">
            <div className="container-fluid">
              <div>
                <House
                  className="text-white fs-1 me-3 "
                  onClick={() => {
                    navigate("/home");
                  }}
                ></House>
                <CurrencyEuro
                  className="text-white fs-1"
                  onClick={() => {
                    navigate("/homeConti");
                  }}
                />
              </div>
              <span className="navbar-brand ms-2 me-0">GestioSalvo</span>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasDarkNavbar"
                aria-controls="offcanvasDarkNavbar"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="offcanvas offcanvas-end text-bg-dark"
                tabIndex="-1"
                id="offcanvasDarkNavbar"
                aria-labelledby="offcanvasDarkNavbarLabel"
              >
                <div className="offcanvas-header text-center">
                  <h5
                    className="offcanvas-title fs-1"
                    id="offcanvasDarkNavbarLabel"
                  >
                    GestioSalvo
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="offcanvas-body">
                  <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                    <li
                      className="nav-item"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                      onClick={handleNavigate("/home")}
                    >
                      Home
                    </li>
                    <li
                      className="nav-item"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                      onClick={handleNavigate("/home")}
                    >
                      <Logout></Logout>
                    </li>

                    <li className="nav-item dropdown show">
                      <a
                        className="nav-link dropdown-toggle"
                        href="a"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Menu
                      </a>
                      <ul className="dropdown-menu dropdown-menu-dark show">
                        <li className="dropdown-item">
                          Fornitori
                          <ul>
                            <li
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                              onClick={handleNavigate("/listSupp")}
                            >
                              Tutti i fornitori
                            </li>
                            <li
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                              onClick={handleNavigate("/addSupp")}
                            >
                              Aggiungi fornitore
                            </li>
                          </ul>
                        </li>

                        <li className="dropdown-item">
                          Prodotti
                          <ul>
                            <li
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                              onClick={handleNavigate("/listProd")}
                            >
                              Tutti i prodotti
                            </li>
                          </ul>
                        </li>
                        <li className="dropdown-item ">
                          Ordini
                          <ul>
                            <li
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                              onClick={handleNavigate("/listOrd")}
                            >
                              Tutti gli ordini
                            </li>
                            <li
                              data-bs-dismiss="offcanvas"
                              aria-label="Close"
                              onClick={handleNavigate("/addOrd")}
                            >
                              Aggiungi ordine
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
};
export default Navbar;
