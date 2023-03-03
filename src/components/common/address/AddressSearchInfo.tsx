import { Button, HStack, Text, useDisclosure, VStack } from "@chakra-ui/react";
import type { FC } from "react";
import type { Address } from "./Address";
import AddressSelectionModal from "./AddressSelectionModal";

interface Props {
  addresses: Address[];
  selectedAddress: Address;
  onChangeAddress: (address: Address) => Promise<void>;
}

/** @example Coffee Shop - Trafalgar, 15 Trafalgar Street, Consett, County Durham, England, DH8 5, United Kingdom */
const formatAddress = (address: Address) => {
  const { PlaceName, Type, Place_addr, CntryName } = address.attributes;
  return `${Type} - ${PlaceName}, ${Place_addr}, ${CntryName}`;
};

const AddressSearchInfo: FC<Props> = ({
  addresses,
  selectedAddress,
  onChangeAddress,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <VStack pl={4} pr={4}>
      <Text>Showing weather for</Text>
      <Text textAlign={"center"}>{formatAddress(selectedAddress)}</Text>
      {addresses.length > 1 && (
        <HStack>
          <Text>Not the right address?</Text>
          <Button variant={"ghost"} onClick={onToggle}>
            Change address ({addresses.length - 1} more)
          </Button>

          {/* modal it is rendered in a Portal, thus can be put anywhere */}
          <AddressSelectionModal
            isOpen={isOpen}
            onClose={onClose}
            addresses={addresses}
            initialSelectedAddress={selectedAddress}
            onConfirm={onChangeAddress}
          />
        </HStack>
      )}
    </VStack>
  );
};

export default AddressSearchInfo;
