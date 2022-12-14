import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SlideFade,
  Text,
  useBoolean,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FC, KeyboardEventHandler, MouseEventHandler, useState } from "react";
import type { ILocation } from "../../api/domain/Location";
import WeatherDetails from "../common/weather/WeatherDetails";
import WeatherIcon from "../common/weather/WeatherIcon";
import type { WeatherData } from "../interfaces";
import { useLocations } from "./locations-state";

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

const CustomNameToolbar: FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <HStack>
      <IconButton
        icon={<CheckIcon />}
        aria-label={"Confirm setting custom name for this location"}
        onClick={onConfirm}
      />
      <IconButton
        icon={<CloseIcon />}
        aria-label={"Cancel setting custom name for this location"}
        onClick={onCancel}
      />
    </HStack>
  );
};

const MobileLocationBlock: FC<Props> = ({ weather, location }) => {
  const { dispatch } = useLocations();
  const hoverBg = useColorModeValue("whiteAlpha.500", "whiteAlpha.100");
  const deleteIconButtonHoverBg = useColorModeValue("red.300", "red.500");
  const [toolbarShown, { toggle: toggleToolbar }] = useBoolean(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingCustomName, { toggle: toggleEditingCustomName }] =
    useBoolean(false);
  const [customName, setCustomName] = useState(location.customName || "");

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
      dispatch({ type: "remove", id: location.id });
    } else {
      // TODO error handling
    }
    onClose();
  };
  const editLocation = () => {
    if (editingCustomName) {
      return;
    }
    toggleEditingCustomName();
  };
  const confirmCustomName = async () => {
    // TODO global state management
    const res = await fetch(`/api/locations/${location.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customName }),
    });
    if (res.ok) {
      dispatch({ type: "set-custom-name", id: location.id, customName });
    } else {
      // TODO handle error
    }
    toggleEditingCustomName();
  };

  const cancelCustomNameEdit = () => {
    toggleEditingCustomName();
    setCustomName(location.customName || "");
  };

  const handleKeyDownOnCustomNameInput: KeyboardEventHandler<
    HTMLInputElement
  > = (event) => {
    if (event.key === "Enter") confirmCustomName();
  };

  const locationName =
    location.customName ||
    (!!location.city && `${location.city}, ${location.countryCode}`) ||
    weather.location;

  return (
    // TODO link to /locations/[location]
    <>
      <ConfirmDeletionModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={deleteLocation}
        location={locationName}
      />
      <VStack>
        <HStack
          padding={{ base: 0, md: 4 }}
          gap={6}
          alignItems={"flex-start"}
          _hover={{
            bg: hoverBg,
          }}
          onClick={() => {
            if (!editingCustomName) toggleToolbar();
          }}
          rounded="xl"
        >
          <WeatherIcon
            typeId={weather.weatherTypeId}
            description={weather.description}
          />
          <WeatherDetails {...weather} />

          <VStack alignItems={"flex-end"} pr={4}>
            {editingCustomName ? (
              <Input
                autoFocus
                value={customName}
                placeholder="Insert custom name..."
                onChange={(e) => setCustomName(e.currentTarget.value)}
                onKeyDown={handleKeyDownOnCustomNameInput}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <Text as="h3" fontSize={"2xl"}>
                {locationName}
              </Text>
            )}
            <Text fontSize={"lg"}>{weather.description}</Text>
          </VStack>
        </HStack>

        <SlideFade in={toolbarShown} offsetY={2} hidden={!toolbarShown}>
          <HStack>
            {editingCustomName ? (
              <CustomNameToolbar
                onCancel={cancelCustomNameEdit}
                onConfirm={confirmCustomName}
              />
            ) : (
              <>
                <IconButton
                  icon={<ViewIcon />}
                  aria-label={"View weather of this location"}
                  as={NextLink}
                  href={`#`} // TODO
                />
                <IconButton
                  icon={<EditIcon />}
                  aria-label={"Edit this location"}
                  onClick={editLocation}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label={`delete the location ${location}. Opens a confirmation modal.`}
                  _hover={{ bg: deleteIconButtonHoverBg }}
                  onClick={openDeleteConfirmation}
                />
              </>
            )}
          </HStack>
        </SlideFade>
      </VStack>
    </>
  );
};

export default MobileLocationBlock;
