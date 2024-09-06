import React from 'react';

const Logout = () => {

    localStorage.clear();
  window.location.reload();

  // Render nothing
  return <div />;
};

export default Logout;
