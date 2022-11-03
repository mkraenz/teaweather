import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useBoolean,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";
import { WeatherData } from "../../interfaces";
import WeatherDetails from "./WeatherDetails";
import WeatherIcon from "./WeatherIcon";

interface Props {
  weather: WeatherData;
  withLocation?: boolean;
  customLocation?: string | undefined;
}

const ConfirmDeletionModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  location: string;
}> = ({ isOpen, onClose, onConfirm, location }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Do you really want to stop tracking the weather of {location}? You
              can always add the location again later.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={"red"} mr={3} onClick={onConfirm}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const LocationBlock: FC<Props> = ({
  weather,
  withLocation,
  customLocation,
}) => {
  const hoverBg = useColorModeValue("whiteAlpha.500", "whiteAlpha.100");
  const deleteIconButtonHoverBg = useColorModeValue("red.300", "red.500");
  const [deleteIconShown, { toggle: toggleDeleteIcon }] = useBoolean(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteLocation = () => {
    // TODO api call to delete location. Here I might get into trouble with state management
    onClose();
  };

  const location = customLocation || weather.location;

  return (
    // TODO link to /locations/[location]
    <NextLink href={"#"}>
      <ConfirmDeletionModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={deleteLocation}
        location={location}
      />
      <HStack
        position={"relative"} // for the delete icon
        padding={{ base: 0, md: 4 }}
        gap="20px"
        alignItems={"flex-start"}
        _hover={{
          bg: hoverBg,
        }}
        onMouseOver={toggleDeleteIcon}
        onMouseOut={toggleDeleteIcon}
        rounded="xl"
      >
        <WeatherIcon
          typeId={weather.weatherTypeId}
          description={weather.description}
        />
        <WeatherDetails {...weather} />
        <VStack alignItems={"flex-end"} pr={4}>
          {withLocation && (
            <Text as="h3" fontSize={"2xl"}>
              {location}
            </Text>
          )}
          <Text>
            {new Date(weather.time).toLocaleString("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </Text>
          <Text fontSize={"lg"}>{weather.description}</Text>
        </VStack>

        {/* TODO mobile support */}
        {deleteIconShown && (
          <IconButton
            top={0}
            left={-2} // cancels out the padding: 4 on the parent
            position="absolute"
            size="lg"
            _hover={{ bg: deleteIconButtonHoverBg }}
            variant="ghost"
            aria-label={`delete the location ${location}. Opens a confirmation modal.`}
            icon={<DeleteIcon />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // don't trigger the link
              onOpen();
            }}
          />
        )}
      </HStack>
    </NextLink>
  );
};

export default LocationBlock;
