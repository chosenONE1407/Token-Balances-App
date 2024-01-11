/* Alchemy Documents: https://docs.alchemy.com/docs/how-to-get-token-balance-for-an-address
                      https://docs.alchemy.com/docs/how-to-get-eth-balance-at-a-point-in-time
*/

import React, { useState, useEffect } from "react";
import { Alchemy, Network, Utils } from "alchemy-sdk";
import {
  Button,
  CircularProgress,
  Container,
  Input,
  Typography,
  List,
  ListItem,
} from "@mui/material";

/**
 * Component to display token balances for a given owner address.
 * @returns JSX element representing the TokenBalances component.
 */

const TokenBalances = () => {
  const [ownerAddress, setOwnerAddress] = useState("");
  const [tokenBalances, setTokenBalances] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState("");

  const formatBalance = (weiBalance) => {
    // Convert hexadecimal to decimal
    const decimalBalance = parseInt(weiBalance, 16);
    return decimalBalance;
  };

  const fetchData = async () => {
    setLoading(true);

    // Validate address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(ownerAddress)) {
      console.error("Invalid address format");
      setLoading(false);
      setAddressError("Invalid address format. Please enter a valid address.");
      return;
    }

    const config = {
      apiKey: "FbF9cvvaRK7pxySz9-NC7GO3RgmtQe6N",
      network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(config);

    try {
      const { tokenBalances } = await alchemy.core.getTokenBalances(
        ownerAddress,
        [
          "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7",
          "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7",
          "0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859",
        ]
      );

      if (Array.isArray(tokenBalances)) {
        setTokenBalances(tokenBalances);
      } else {
        console.error("Unexpected data structure:", tokenBalances);
      }
    } catch (error) {
      console.error("Error fetching token balances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset token balances and address error when the owner address changes
    setTokenBalances(null);
    setAddressError("");
  }, [ownerAddress]);

  return (
    <div>
      <Container
        maxWidth="md"
        sx={{
          mt: 2,
          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >
        <div>
          <br></br>
          <br></br>
          <Input
            placeholder="Enter Owner Address"
            value={ownerAddress}
            onChange={(e) => setOwnerAddress(e.target.value)}
          />

          {/* error message */}
          {addressError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {addressError}
            </Typography>
          )}

          {/* horizontal gap */}
          <span style={{ marginLeft: "3rem" }} />

          <Button
            variant="contained"
            onClick={fetchData}
            disabled={!ownerAddress || loading}
            sx={{ mt: 2, color: "text.primary" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Fetch Balances"
            )}
          </Button>
        </div>

        {tokenBalances !== null && (
          <div>
            {loading ? (
              <CircularProgress size={40} sx={{ mt: 2 }} />
            ) : (
              <List sx={{ mt: 2 }}>
                {tokenBalances.map((tokenBalance) => (
                  <ListItem key={tokenBalance.contractAddress}>
                    {`Token: ${
                      tokenBalance.contractAddress
                    }, Balance: ${Utils.formatEther(
                      tokenBalance.tokenBalance
                    )}ETH`}
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        )}

        {!loading && tokenBalances === null && !addressError && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Enter an owner address and fetch balances.
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default TokenBalances;
