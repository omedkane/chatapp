import { store } from "@app/store";
import { AuthenticationScreen } from "@pages/authentication/authentication";
import { AvatarUploadScreen } from "@pages/authentication/avatar_upload.screen";
import { Home } from "@pages/home/home.screen";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthenticationScreen />} />
          <Route path="/avatar" element={<AvatarUploadScreen />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
