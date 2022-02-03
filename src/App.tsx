import { store } from "@app/store";
import { AuthenticationScreen } from "@pages/authentication/authentication";
import { Marco } from "@pages/marco/marco";
import { Reus } from "@pages/reus/reus";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthenticationScreen />} />
          <Route path="marco" element={<Marco />} />
          <Route path="marco/:name" element={<Marco />} />
          <Route path="reus" element={<Reus />} />
          <Route path="reus/:name" element={<Reus />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
