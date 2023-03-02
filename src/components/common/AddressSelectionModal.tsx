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
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

type Address = {
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

  const bg =
    // TODO color + dark/light mode
    isSelected ? accentColor : undefined;
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
  // TODO only show 10 results and allow to 'show more results'
  const handleSelect = () => {
    onConfirm(selected);
    onClose();
  };
  const handleClose = () => {
    select(initialSelectedAddress);
    onClose();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <List spacing={3}>
              {addresses.map((address) => {
                const key = toKey(address);
                const isSelected = toKey(selected) === toKey(address);
                return (
                  <AddressListItem
                    key={key}
                    isSelected={isSelected}
                    onSelect={select}
                    address={address}
                  />
                );
              })}
            </List>
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
