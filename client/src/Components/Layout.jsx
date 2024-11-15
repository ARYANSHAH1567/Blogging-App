import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout component that serves as a wrapper for all pages.
 * Includes the `Header` and `Footer` components, and renders the appropriate page content in between.
 *
 * @component
 * @returns {JSX.Element} The rendered layout component with header, content, and footer.
 */
const Layout = () => {
  return (
    <>
      {/* Render the Header component */}
      <Header />

      {/* Render the content for the current route */}
      <Outlet />

      {/* Render the Footer component */}
      <Footer />
    </>
  );
};

export default Layout;
