import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import type { FC, KeyboardEventHandler } from "react";

interface Props {
  onInput: (value: string) => void;
  onSearch: () => void;
  label?: string;
  icon?: "search" | "add";
}

const SearchByCity: FC<Props> = ({
  onInput,
  onSearch,
  label = "Search by City and Country",
  icon = "search",
}) => {
  const searchInputTextColor = useColorModeValue("gray.600", "gray.300");
  const searchButtonColor = useColorModeValue("cyan.200", "blue.700");
  const searchButtonHoverColor = useColorModeValue("cyan.100", "blue.800");

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
        {label}
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
        <InputRightElement h="full">
          <Tooltip label={icon === "search" ? "Search" : "Add location"}>
            <IconButton
              aria-label={icon === "search" ? "Search" : "Add location"}
              onClick={onSearch}
              icon={icon === "search" ? <SearchIcon /> : <AddIcon />}
              color={searchInputTextColor}
              _hover={{
                bg: searchButtonHoverColor,
              }}
              bg={searchButtonColor}
            />
          </Tooltip>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default SearchByCity;
