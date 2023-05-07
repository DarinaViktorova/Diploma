import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import NotFound from './components/notFound/NotFound';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Chat from './pages/chat/Chat';


function App() {

  const { user } = useContext(AuthContext)

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          { user ? <Home/> : <Login/>}
        </Route>
        <Route  path="/login">
          {user ? <Redirect to="/" /> : <Login/>}
        </Route>
        <Route path="/register">
        {user ? <Redirect to="/" /> : <Register/>}
        </Route>
        <Route  path="/chat">
          {user ? <Chat/> : <Login/>}
        </Route>
        <Route path="/profile/:username">
          <Profile/>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
