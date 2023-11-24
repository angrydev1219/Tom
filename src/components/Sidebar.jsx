"use client";

import {
  Box,
  Flex,
  Text,
  Spinner,
  Button,
  Input,
  Grid,
  useToast,
} from "@chakra-ui/react";

import { SingleCard } from "./Card";

import { useState } from "react";

import { useConnect, useDisconnect, useAccount } from "wagmi";
import { goerli } from "@wagmi/core/chains";

import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { getPublicClient } from "wagmi/actions";
import { createPublicClient, custom } from "viem";

import contractAbi from "../contractABi/contractAbi.json";

const Sidebar = () => {
  const [inputAddress, setInputAddress] = useState("");
  const toast = useToast();

  const [nfts, setNfts] = useState([]);
  const { disconnect } = useDisconnect();

  const [loading, setLoading] = useState(false);

  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new MetaMaskConnector({
      chains: [goerli],
    }),
    chainId: goerli.id,
  });

  const connectWallet = async () => {
    connect();
  };
  function connectPublicClient() {
    let transport;
    if (window.ethereum) {
      transport = custom(window.ethereum);
    } else {
      const errorMessage =
        "MetaMask or another web3 wallet is not installed. Please install one to proceed.";
      throw new Error(errorMessage);
    }

    // Delcare a Public Client
    const publicClient = createPublicClient({
      chain: goerli,
      transport: transport,
    });
    return publicClient;
  }
  // 0xcC462Cae21b522b34acb02F3B7D0f4DC7B66933d
  const fetchNFTs = async () => {
    try {
      await setLoading(true);
      if (!address) {
        toast({
          title: `Please connect your MetaMast!`,
          status: "warning",
          isClosable: true,
        });
      } else {
        const { readContract } = getPublicClient({ chainId: 5 });
        const resData = await readContract({
          address: inputAddress,
          abi: contractAbi,
          functionName: "balanceOf",
          args: ["0xCAFE54797A401c4e6C37A556A38395122DdeAE70"],
        });
        console.log("resdata-----", resData);
        let publicClient = connectPublicClient();
        console.log("publicClient", await publicClient.getBlockNumber());
        const filter = await publicClient.createContractEventFilter({
          address: inputAddress,
          abi: contractAbi,
          fromBlock: 100n,
          evetName: "Transfer",
        });
        const logs = await publicClient.getFilterLogs({ filter });

        let transferLogs = logs.filter((e) => e.eventName === "Transfer");

        let toNfts = transferLogs.filter((e) => e.args["to"] === address);
        let fromNfts = transferLogs.filter((e) => e.args["from"] === address);

        let nfts = toNfts.filter(
          (value) =>
            !fromNfts.some(
              (e) =>
                e["args"]["tokenId"] === value["args"]["tokenId"] &&
                e["args"]["from"] === value["args"]["to"]
            )
        );

        console.log(nfts);
        await setNfts(nfts);
      }
      setLoading(false);
    } catch (err) {
      toast({
        title: `Please input valid address!`,
        status: "error",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        minH="100vh"
        width="100%"
        backgroundRepeat="no-repeat"
        backgroundSize="100% 100%"
        bgImage={"./bgImage.jpg"}
      >
        <Box>
          <Flex
            px="16px"
            height="20"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box display={{ base: "none", md: "block" }}>
              <Flex gap={4}>
                <Input
                  borderRadius={"20px"}
                  border={"1px solid #FFFFFF"}
                  minW={"500px"}
                  placeholder={"Contract Address"}
                  color="#FFFFFF"
                  fontFamily={"Poppins"}
                  fontSize={"18px"}
                  fontStyle={"normal"}
                  paddingLeft={"20px"}
                  value={inputAddress}
                  height={"50px"}
                  onChange={(e) => setInputAddress(e.target.value)}
                />

                <Button
                  bg={"linear-gradient(131deg, #7C0F35 0%, #581266 100%)"}
                  color="#FFFFFF"
                  fontFamily={"Poppins"}
                  fontSize={"16px"}
                  width={"160px"}
                  height={"50px"}
                  borderRadius={"20px"}
                  fontWeight={"400"}
                  onClick={fetchNFTs}
                >
                  Fetch NFT
                </Button>
              </Flex>
            </Box>
            <Box alignItems={"center"}>
              {isConnected === false ? (
                <Button
                  bg={"linear-gradient(131deg, #7C0F35 0%, #581266 100%)"}
                  color="#FFFFFF"
                  fontFamily={"Poppins"}
                  fontSize={"16px"}
                  width={"160px"}
                  height={"50px"}
                  borderRadius={"20px"}
                  fontWeight={"400"}
                  onClick={connectWallet}
                >
                  Connect
                </Button>
              ) : (
                <Button
                  bg={"linear-gradient(131deg, #7C0F35 0%, #581266 100%)"}
                  color="#FFFFFF"
                  fontFamily={"Poppins"}
                  fontSize={"16px"}
                  width={"160px"}
                  height={"50px"}
                  borderRadius={"20px"}
                  fontWeight={"400"}
                  onClick={() => {
                    disconnect();
                  }}
                >
                  Disconnect
                </Button>
              )}
            </Box>
          </Flex>
        </Box>
        <Box p="4">
          <>
            <Box zIndex={10} ml={"8px"}>
              <Text
                fontFamily={"Work Sans"}
                fontSize={"22px"}
                color={"#FFFFFF"}
              >
                Your Own NFTS : {nfts.length}
              </Text>
            </Box>
            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="80vh"
              >
                <Spinner size="xl" color="#FFFFFF" />
              </Box>
            ) : (
              <>
                <Grid mt={"8px"} templateColumns="repeat(4, 1fr)" gap={6}>
                  {nfts?.map((el, i) => (
                    <SingleCard key={i} data={el} />
                  ))}
                </Grid>
              </>
            )}
          </>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
