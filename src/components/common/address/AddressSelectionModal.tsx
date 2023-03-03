import { StarIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  HStack,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export type Address = {
  address: string;
  location: {
    x: number;
    y: number;
  };
  score: number;
  attributes: {
    Type: string;
    Place_addr: string;
    PlaceName: string;
    Country: string;
    CntryName: string;
  };
};

const AddressListItem = ({
  onSelect,
  isSelected,
  address,
}: {
  onSelect: (address: Address) => void;
  isSelected: boolean;
  address: Address;
}) => {
  const accentColor = useColorModeValue("cyan.500", "cyan.400");

  const bg = isSelected ? accentColor : undefined;
  return (
    <>
      <ListItem onClick={() => onSelect(address)} display={"flex"}>
        <HStack>
          <ListIcon
            as={isSelected ? StarIcon : TriangleUpIcon}
            color={bg}
            boxSize={4}
            transform={isSelected ? undefined : "rotate(90deg)"}
          />
          <Stack gap={0}>
            {/* chakra puts weird margin on the stack elements https://github.com/chakra-ui/chakra-ui/issues/2578#issuecomment-981121992 */}
            <Text style={{ margin: 0 }}>
              {address.attributes.PlaceName} - {address.attributes.Type}
            </Text>
            <Text style={{ margin: 0 }}>{address.attributes.Place_addr}</Text>
            <Text style={{ margin: 0 }}>{address.attributes.CntryName}</Text>
          </Stack>
        </HStack>
      </ListItem>
      <Divider />
    </>
  );
};

const toKey = (address: Address) =>
  `${address.location.x},${address.location.y}`;

const initialLimit = 5;

const AddressSelectionModal = ({
  isOpen,
  onClose,
  addresses,
  initialSelectedAddress,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  initialSelectedAddress: Address;
  onConfirm: (address: Address) => Promise<void>;
}) => {
  const [selected, select] = useState(initialSelectedAddress);
  const [limit, setLimit] = useState(initialLimit);
  const handleSelect = () => {
    onConfirm(selected);
    setLimit(initialLimit);
    onClose();
  };
  useEffect(() => {
    // workaround: when searching more than once, the `selected` state got preserved. this forces a reset to the newest search result
    select(initialSelectedAddress);
  }, [initialSelectedAddress]);

  const handleClose = () => {
    select(initialSelectedAddress);
    setLimit(initialLimit);
    onClose();
  };
  const initialSelectedKey = toKey(initialSelectedAddress);
  const additionalAddresses = addresses
    .slice(0, limit)
    .filter((a) => initialSelectedKey !== toKey(a));
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <List spacing={3}>
              {/* always show the initially selected address on top */}
              <AddressListItem
                isSelected={toKey(initialSelectedAddress) === toKey(selected)}
                onSelect={select}
                address={initialSelectedAddress}
              />
              {additionalAddresses.map((address) => {
                const key = toKey(address);
                return (
                  <AddressListItem
                    key={key}
                    isSelected={toKey(selected) === toKey(address)}
                    onSelect={select}
                    address={address}
                  />
                );
              })}
            </List>
            <HStack mt={4} justify="space-between">
              <Tooltip
                label={
                  limit >= addresses.length
                    ? "No further addresses to display"
                    : undefined
                }
              >
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setLimit(Math.min(limit + 10, addresses.length))
                  }
                  disabled={limit >= addresses.length}
                >
                  Show more results
                </Button>
              </Tooltip>
              <Text>
                {additionalAddresses.length + 1} of {addresses.length} displayed
              </Text>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="solid" onClick={handleSelect}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddressSelectionModal;
