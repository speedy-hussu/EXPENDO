import { Container, Nav } from "./components/componentIndex";
import "./App.css";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <Container>
      <Nav />
      <Outlet />
    </Container>
  );
}

export default App;
