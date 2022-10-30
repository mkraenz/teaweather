import { useUser } from "@auth0/nextjs-auth0";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  CircularProgress,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";

interface RendererProps {
  avatarSrc: string;
  username: string;
  userEmail: string;
}

const MyAvatarRenderComp: FC<RendererProps> = ({
  avatarSrc,
  username,
  userEmail,
}) => {
  const emailColor = useColorModeValue("gray.600", "whiteAlpha.700");

  return (
    <Flex alignItems={"center"}>
      <Menu>
        <MenuButton transition="all 0.3s" _focus={{ boxShadow: "none" }}>
          <HStack>
            <Avatar size={"sm"} src={avatarSrc} />
            <VStack
              display={{ base: "none", md: "flex" }}
              alignItems="flex-start"
              spacing="1px"
            >
              <Text fontSize="sm">{username}</Text>
              <Text fontSize="xs" color={emailColor}>
                {userEmail}
              </Text>
            </VStack>
            <Box display={{ base: "none", md: "flex" }}>
              <ChevronDownIcon />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList
          bg={useColorModeValue("white", "gray.900")}
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          {MENU_ITEMS.map((item) => {
            return (
              <div key={item.label}>
                {item.withDividerTop && <MenuDivider />}
                <MenuItem as={NextLink} href={item.href}>
                  {item.label}
                </MenuItem>
              </div>
            );
          })}
        </MenuList>
      </Menu>
    </Flex>
  );
};

const MENU_ITEMS = [
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
  { label: "Billing", href: "/billing" },
  { label: "Sign out", href: "/api/auth/logout", withDividerTop: true },
];

const MyAvatar: FC = () => {
  const { user, isLoading } = useUser();
  if (isLoading || !user) return <CircularProgress />;

  return (
    <MyAvatarRenderComp
      avatarSrc={user.picture || ""}
      userEmail={user.email || ""}
      username={user.name || user.nickname || "No name"}
    />
  );
};

export default MyAvatar;
