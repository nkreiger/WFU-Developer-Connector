import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux"; // whenever using redux components
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";
// CSS
import "./register.css";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      // object with some values
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this); // must bind
    this.onSubmit = this.onSubmit.bind(this); // bind
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  // runs when your component receives new properties
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        // get errors from redux, put into props
        errors: nextProps.errors // sets errors to new props component state
      });
    }
  }

  onChange(e) {
    // e is an event object
    this.setState({
      [e.target.name]: e.target.value
    }); // get whatever user types and assign it to name
  }

  onSubmit(e) {
    e.preventDefault(); // since its a form don't want default behvior
    // now go through redux
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    // console.log(newUser) to test
    // you don't have to do localhost because we put proxy in the package.json

    this.props.registerUser(newUser, this.props.history);
    // this.props.history in combination with withRouter allows:
    // to use this.props.history to redirect from within an action, not the component
  }

  render() {
    const { errors } = this.state;
    // same as const errors = this.state.errors;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your WakeDev Account and start <br />Connecting with
                other Students today!
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Name"
                  name="name" // default type is text
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                <TextFieldGroup
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                  info="This site uses Gravatar for profile images"
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  // for any prop types you have to map them
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

// get state into component, putting auth state inside a property called auth
// comes from rootReducer, has to match!!!
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
