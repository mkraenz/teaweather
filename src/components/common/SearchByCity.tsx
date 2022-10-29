import { SearchIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, KeyboardEventHandler } from "react";

interface Props {
  onInput: (value: string) => void;
  onSearch: () => void;
}

const SearchByCity: FC<Props> = ({ onInput, onSearch }) => {
  const searchInputTextColor = useColorModeValue("gray.600", "gray.300");
  const searchButtonColor = useColorModeValue("cyan.300", "blue.700");
  const searchButtonHoverColor = useColorModeValue("cyan.200", "blue.800");

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <FormControl
      maxW={{
        base: "full",
        md: 360,
      }}
      px={4}
    >
      <FormLabel
        htmlFor="search"
        fontWeight={"normal"}
        color={searchInputTextColor}
      >
        Search by City and Country
      </FormLabel>
      <InputGroup size="md">
        <Input
          placeholder="Example: Tokyo, jp"
          variant="filled"
          bg="whiteAlpha.200"
          color={searchInputTextColor}
          pr="4.5rem"
          type={"search"}
          onChange={(e) => onInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement>
          <IconButton
            size="md"
            aria-label="Search"
            onClick={onSearch}
            icon={<SearchIcon />}
            color={searchInputTextColor}
            _hover={{
              bg: searchButtonHoverColor,
            }}
            bg={searchButtonColor}
          ></IconButton>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default SearchByCity;
