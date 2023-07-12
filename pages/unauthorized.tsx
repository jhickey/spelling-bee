import { authPage } from '../src/utils/auth';

export default function Unauthorized() {
  return <div>Unauthorized</div>;
}
export const getServerSideProps = async ({ req }) => {
  const userId = await authPage(req);
  if (userId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
