import {
  Button,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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

const toKey = (address: Address) =>
  `${address.location.x},${address.location.y}`;

const formatAddress = (address: Address) => {
  const { PlaceName, Type, Place_addr, CntryName } = address.attributes;
  return `${Type} - ${PlaceName}, ${Place_addr}, ${CntryName}`;
};

const AddressSelectionModal = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddress: Address;
  onConfirm: (address: Address) => Promise<void>;
}) => {
  const [selected, select] = useState(selectedAddress);
  // TODO only show 10 results and allow to 'show more results'
  const handleSelect = () => {
    onConfirm(selected);
    onClose();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* TODO make this look nice */}
            <List spacing={3}>
              {addresses.map((address) => {
                console.log(address);
                const key = toKey(address);
                const bg =
                  // TODO color + dark/light mode
                  toKey(selected) === toKey(address) ? "green.500" : undefined;
                return (
                  <ListItem key={key} onClick={() => select(address)} bg={bg}>
                    {formatAddress(address)}
                  </ListItem>
                );
              })}
            </List>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} variant="ghost" onClick={onClose}>
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
