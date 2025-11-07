"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { eventABI } from "../lib/service/abi";
// import { getContractAddress } from "../lib/service/getContractAddress";
import { useAccount } from "wagmi";
import { useState } from "react";

export interface CreateEventContractParams {
  title: string;
  location: string;
  maxAttendees: number;
  description: string;
  tags: string[];
  startsAt: bigint;
  endsAt: bigint;
}

export function useEventContract() {
  const { chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const [isCreating, setIsCreating] = useState(false);

  console.log(" chainId", chainId);

  // Aguarda confirmação da transação
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createPublicEvent = async (params: CreateEventContractParams) => {
    try {
      setIsCreating(true);

      //   const contractAddress = getContractAddress(
      //     chainId || 8453, // Default para Base Sepolia
      //     "EVENT_FACTORY"
      //   );
      const contractAddress = "0x478E2322e0b7bD28d522bFD1a39E7ecD38f34AC0";

      console.log(" contractAddress", contractAddress);
      console.log(" params", params);
      writeContract({
        address: contractAddress,
        abi: eventABI,
        functionName: "createPublicEvent",
        args: [
          params.title,
          params.location,
          BigInt(params.maxAttendees),
          params.description,
          params.tags,
          params.startsAt,
          params.endsAt,
        ],
        maxFeePerGas: BigInt(1000000000000000000),
      });

      return hash;
    } catch (err) {
      console.error("Error creating event on contract:", err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPublicEvent,
    isPending: isPending || isConfirming || isCreating,
    isSuccess,
    hash,
    error,
  };
}
