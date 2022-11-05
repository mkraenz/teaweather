import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import type { FC, MouseEventHandler } from "react";
import type { ILocation } from "../../../api/domain/Location";
import type { WeatherData } from "../../interfaces";
import WeatherDetails from "./WeatherDetails";
import WeatherIcon from "./WeatherIcon";

interface Props {
  weather: WeatherData;
  location: ILocation;
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

const LocationBlock: FC<Props> = ({ weather, location }) => {
  const hoverBg = useColorModeValue("whiteAlpha.500", "whiteAlpha.100");
  const deleteIconButtonHoverBg = useColorModeValue("red.300", "red.500");
  const [deleteIconShown, { toggle: toggleDeleteIcon }] = useBoolean(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toolbarHiddenOnMobile = useBreakpointValue(
    { base: true, md: false },
    { fallback: "md" }
  );

  const openDeleteConfirmation: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation(); // don't trigger the link
    onOpen();
  };
  const deleteLocation = async () => {
    // TODO global state management
    const res = await fetch(`/api/locations/${location.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert(
        "Location deleted. Refresh the page to see the changes. Improved workflow coming soon."
      );
    }
    onClose();
  };
  const editLocation = () => {
    alert("Feature coming soon");
  };

  const locationName =
    location.customName ||
    (!!location.city && `${location.city}, ${location.countryCode}`) ||
    weather.location;

  return (
    // TODO link to /locations/[location]
    <NextLink href={"#"}>
      <ConfirmDeletionModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={deleteLocation}
        location={locationName}
      />
      <HStack
        position={"relative"} // for the delete icon
        padding={{ base: 0, md: 4 }}
        gap={6}
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
          <Text as="h3" fontSize={"2xl"}>
            {locationName}
          </Text>
          <Text>
            {new Date(weather.time).toLocaleString("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </Text>
          <Text fontSize={"lg"}>{weather.description}</Text>
        </VStack>
        {/* TODO mobile support */}
        <VStack alignSelf={"center"} hidden={toolbarHiddenOnMobile}>
          <IconButton
            icon={<EditIcon />}
            aria-label={"Edit this location"}
            visibility={deleteIconShown ? "visible" : "hidden"}
            onClick={editLocation}
          />
          <IconButton
            icon={<DeleteIcon />}
            aria-label={`delete the location ${location}. Opens a confirmation modal.`}
            _hover={{ bg: deleteIconButtonHoverBg }}
            onClick={openDeleteConfirmation}
            visibility={deleteIconShown ? "visible" : "hidden"}
          />
        </VStack>
      </HStack>
    </NextLink>
  );
};

export default LocationBlock;
