import React from 'react';

const RootPage = () => {
  return <>Root page</>;
};

RootPage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
});

export default RootPage;
