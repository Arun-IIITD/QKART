
import ipConfig from "./ipConfig.json";
import React from "react";
import Register from "./components/Register";
import Login from "./components/Login"
import Products from "./components/Products";
import Cart from "./components/Cart"
import Checkout from "./components/Checkout"
import Thanks from "./components/Thanks"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};





function App() {
  return (

    <Router>
    <div className="App">
      <Switch>
     
      <Route exact path="/" component={Products} />
      {/* <Route exact path="/products" component={Products} /> */}
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/cart" component={Cart} />
      <Route path = "/checkout" component = {Checkout} />
      <Route path = "/thanks" component = {Thanks} />
      </Switch>
    </div>
  </Router>





);
}

export default App;
