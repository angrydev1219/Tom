import { Card, CardBody, Text, Box, SimpleGrid, Img } from "@chakra-ui/react";
export const SingleCard = ({ data }) => {
  const { args } = data;

  const mintAddress = "0x0000000000000000000000000000000000000000";

  return (
    <>
      <Box fontFamily={"Poppins"} width="100%">
        <Card bg={"#390554"} w="100%" padding={"5px 0px 5px 0px"}>
          <CardBody>
            <Img src="/1.jpg" />
            <SimpleGrid
              gridTemplateColumns={"repeat(2,1fr)"}
              color={"#F5F5F5"}
              lineHeight={"normal"}
              fontSize={"13px"}
              rowGap={"8px"}
              mt="8px"
            >
              <Text color={"#FFFFFF"} fontSize={"16px"} mb={"15px"}>
                Token ID
              </Text>
              <Text color={"#FFFFFF"} fontSize={"16px"} mb={"15px"}>
                {args.tokenId.toString()}
              </Text>
              <Text wordBreak={"break-word"}>from</Text>
              <Text wordBreak={"break-word"}>
                {args.from === mintAddress
                  ? "Mint"
                  : `${args.from.slice(0, 5)} ... ${args.from.slice(-4)}`}
              </Text>
              <Text>to</Text>
              <Text wordBreak={"break-word"}>
                {args.to.slice(0, 5)}...{args.to.slice(-4)}
              </Text>
            </SimpleGrid>
          </CardBody>
        </Card>
      </Box>
    </>
  );
};
