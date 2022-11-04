import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Progress, Text } from "@chakra-ui/react";

function Profile() {
  const { user, isLoading } = useUser();

  return (
    <>
      {isLoading && <Progress />}
      {user && (
        <div data-testid="profile-json">
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Progress />,
  onError: (error) => <Text>{error.message}</Text>,
});
