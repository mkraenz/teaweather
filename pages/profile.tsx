import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Progress, Text, VStack } from "@chakra-ui/react";
import MyAvatar from "../src/components/common/layout/MyAvatar";

function Profile() {
  const { user, isLoading } = useUser();

  return (
    <>
      {isLoading && <Progress />}
      {user && (
        <>
          <VStack
            className="align-items-center profile-header mb-5 text-center text-md-left"
            data-testid="profile"
          >
            <MyAvatar />
          </VStack>
          <div data-testid="profile-json">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Progress />,
  onError: (error) => <Text>{error.message}</Text>,
});
