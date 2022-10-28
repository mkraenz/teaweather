import { Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const bgGradientTo = useColorModeValue("cyan-200", "cyan-900");
  const bgGradientFrom = useColorModeValue("white", "blue-900");
  return (
    <Grid
      minH="100vh"
      minW="100vw"
      bg={`linear-gradient(0deg, var(--chakra-colors-${bgGradientFrom}) 0%, var(--chakra-colors-${bgGradientTo}) 100%);`}
      templateAreas={`
      "navbar"
      "main"
      "footer"
    `}
      gridTemplateRows={"70px 1fr 30px"}
    >
      <GridItem area="navbar" as="nav">
        <Navbar />
      </GridItem>

      <GridItem area="main" as="main">
        {children}
      </GridItem>

      <GridItem area="footer" as="footer">
        <Footer />
      </GridItem>
    </Grid>
  );
};

export default Layout;
