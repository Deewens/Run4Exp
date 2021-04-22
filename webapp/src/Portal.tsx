import React from "react";
import ReactDOM from "react-dom"

const portalRoot = document.getElementById("portal");

export class Portal extends React.Component {
  constructor() {
    // @ts-ignore
    super();
    // 1: Create a new div that wraps the component
    // @ts-ignore
    this.el = document.createElement("div");
  }
  // 2: Append the element to the DOM when it mounts
  componentDidMount = () => {
    // @ts-ignore
    portalRoot.appendChild(this.el);
  };
  // 3: Remove the element when it unmounts
  componentWillUnmount = () => {
    // @ts-ignore
    portalRoot.removeChild(this.el);
  };
  render() {
    // 4: Render the element's children in a Portal
    const { children } = this.props;
    //@ts-ignore
    return ReactDOM.createPortal(children, this.el);
  }
}