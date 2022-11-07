import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MainPage from "./pages/MainPage";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    // Context & ThemeProvider
    <>
      <Sidebar />
      <div className="main">
        <MainPage />
      </div>
    </>
  );
}
