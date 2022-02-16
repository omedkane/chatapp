import { store } from "@app/store";
import { AuthenticationScreen } from "@pages/authentication/authentication";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthenticationScreen />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
