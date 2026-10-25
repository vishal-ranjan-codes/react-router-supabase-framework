import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import {
  type AuthMethod,
  authConfig,
  getEnabledFormMethods,
  getMethodLabel,
} from "~/lib/auth/config";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

afterEach(() => {
  cleanup();
  authConfig.methods.emailPassword = true;
  authConfig.methods.emailOtp = true;
  authConfig.methods.magicLink = false;
  authConfig.methods.google = false;
  authConfig.defaultMethod = "email-password";
  authConfig.passwordReset = true;
});

/** The button that proves a method's panel actually mounted. */
const PANEL_SUBMIT: Record<AuthMethod, string> = {
  "email-password": "Sign In",
  "email-otp": "Send Code",
  "magic-link": "Send Magic Link",
  google: "Sign in with Google",
};

function renderSignIn() {
  const Stub = createRoutesStub([
    { id: "sign-in", path: "/sign-in", Component: SignIn },
  ]);
  return render(<Stub initialEntries={["/sign-in"]} />);
}

function renderSignUp() {
  const Stub = createRoutesStub([
    { id: "sign-up", path: "/sign-up", Component: SignUp },
  ]);
  return render(<Stub initialEntries={["/sign-up"]} />);
}

describe("auth surface", () => {
  it("mounts a reachable panel for every enabled form method", () => {
    authConfig.methods.magicLink = true;
    renderSignIn();

    // A method that is enabled but never rendered is the failure this starter is most prone to.
    for (const method of getEnabledFormMethods()) {
      fireEvent.click(
        screen.getByRole("button", { name: getMethodLabel(method) }),
      );
      expect(
        screen.getByRole("button", { name: PANEL_SUBMIT[method] }),
      ).toBeInTheDocument();
    }
  });

  it("opens on the configured default method", () => {
    authConfig.defaultMethod = "email-otp";
    renderSignIn();

    expect(
      screen.getByRole("button", { name: "Send Code" }),
    ).toBeInTheDocument();
  });

  it("opens on the first enabled method when the default is disabled", () => {
    authConfig.methods.emailPassword = false;
    authConfig.methods.magicLink = true;
    renderSignIn();

    expect(
      screen.getByRole("button", { name: "Send Code" }),
    ).toBeInTheDocument();
  });

  it("hides the selector when there is nothing to choose between", () => {
    authConfig.methods.emailOtp = false;
    renderSignIn();

    expect(
      screen.queryByRole("button", { name: "Email OTP" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("offers the OAuth divider and button only when the provider is enabled", () => {
    renderSignIn();
    expect(
      screen.queryByRole("button", { name: "Sign in with Google" }),
    ).not.toBeInTheDocument();

    cleanup();
    authConfig.methods.google = true;
    renderSignIn();

    expect(
      screen.getByRole("button", { name: "Sign in with Google" }),
    ).toBeInTheDocument();
    expect(screen.getByText("or continue with")).toBeInTheDocument();
  });

  it("refuses to render a panel for a disabled method", () => {
    authConfig.methods.emailPassword = false;
    authConfig.methods.emailOtp = false;
    renderSignIn();

    // The fallback default names email-password, but its action always rejects, so the page has
    // to say what is wrong instead of showing a form that cannot work.
    expect(
      screen.queryByRole("button", { name: "Sign In" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/No authentication methods are enabled/),
    ).toBeInTheDocument();
  });

  it("renders the same methods on sign up, minus the reset affordance", () => {
    renderSignIn();
    expect(
      screen.getByRole("button", { name: "Forgot password?" }),
    ).toBeInTheDocument();

    cleanup();
    renderSignUp();

    expect(
      screen.queryByRole("button", { name: "Forgot password?" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("drops the reset link when the config turns password reset off", () => {
    authConfig.passwordReset = false;
    renderSignIn();

    expect(
      screen.queryByRole("button", { name: "Forgot password?" }),
    ).not.toBeInTheDocument();
  });
});
